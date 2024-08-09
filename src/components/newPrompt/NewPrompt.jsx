import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const initialChatHistory = data?.history?.map(({ role, parts }) => ({
    role,
    parts: [{ text: parts[0].text }],
  })) || [];

  // Validate initial chat history
  if (initialChatHistory.length === 0 || initialChatHistory[0].role !== 'user') {
    console.error("First content should be with role 'user'");
  }

  const chat = model.startChat({
    history: initialChatHistory,
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);

    try {
      const prompt = `${text} Answer in bullet points.
      Also answer according to this data:
      
Data Sanity: Showcase in a detailed call to customer​
Data Sanity: Communicate- inter object data mismatch, wrong data provided from core systems, wrong mapping- QF not in a position to verify​
Data Sanity: Only verification we do is, received data should match data uploaded   ​
Data Sanity: We have to be the HUMBLEST of the lot ; make the team realize that they are the SUPPORT SYSTEM of the project   ​
Communication: Team MUST connect, whether agenda is defined or not. Only regular conversations would bring out open items​
Communication: The time for verbal confirmations is long gone ; Pessimistic approach is best applicable for us ; we must ask the team for showcasing progress​
Communication: Governance should have a QUICK RESPONSE TEAM (inter/intra project)​
Communication: Too much noise dissolves the key highlight you want to make​
Communication: Communication must be consistent​
Communication: When team not responding, ensure all communication platforms are explored​
Communication: Even a non-technical person can achieve closure in a technical task by ASKING RIGHT QUESTIONS ​
Communication: If I master the skill of accepting criticism (valid/invalid), I can only grow (state example of terms used by customer)​
Data Migration: Checklist for project phase – UAT / DATA MIGRATION​
Administrative: Governance must ensure holiday calendar of resources is updated every fortnight​
Resourcing: Managing a project without a resource plan is like navigating a ship without a map or a compass​
Resourcing: One Expectation setting call before development kick off – with outsourced team, in presence of Sales, Tech lead, BA, Governance – MUST​
Resourcing: Intra team RACI to be defined in above call​
Resourcing: One INTERNAL tech-lead to be aligned with each OUTSOURCED tech lead (extension of buddy program)​
Requirements: Requirements traceablity matrix is a must for project manager & team to ensure all requirements are traced from SOW to FRD to Dev to QA to UAT to Prod
Project Plan: It's essential to ensure we are able to provide upto a week for a soution approach
Project Plan: Project plan complenets have a delay tracker.  This delay tracker has to record by chronology what are the delays by when e.g. of this can be seen on projects like khimji

      `;
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, prompt] : [prompt]
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      mutation.mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text, false);
  };

  // IN PRODUCTION WE DON'T NEED IT
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {/* ADD NEW CHAT */}
      {img.isLoading && <div className="">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
