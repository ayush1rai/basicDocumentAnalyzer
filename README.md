# basicDocumentAnalyzer

**What is this?**  
A sandbox tool to explore retrieval-augmented generation (RAG) using vector search via ChromaDB, LangChain orchestration, and the `phi3:mini` lightweight base LLM.

---

##  Core Components

- **phi3:mini**  
  Lightweight language model for fast local inference.
- **ChromaDB**  
  Efficient vector database for embeddings and nearest-neighbor search.
- **LangChain**  
  Orchestrates workflows—embedding, vectorizing, retrieval, and generation.

---

##  Why This Exists

I wanted hands-on exposure to:
- How vector embedding + retrieval can drive AI workflows.
- What lightweight LLMs like `phi3:mini` are capable of.
- How LangChain glues it all together in an end-to-end pipeline.

---

##  Getting Started

```bash
git clone https://github.com/ayush1rai/basicDocumentAnalyzer.git
cd basicDocumentAnalyzer
# Optional: Set up virtual environment
pip install -r requirements.txt
