from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from parser import extract_text
from analyzer import analyze_resume
import os
import uvicorn
from dotenv import load_dotenv

load_dotenv()

if not os.getenv("GROQ_API_KEY"):
    raise RuntimeError("❌ GROQ_API_KEY is missing! Check your .env file.")

app = FastAPI(title="AI Resume Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def home():
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(BASE_DIR, "static", "index.html"), encoding="utf-8") as f:
        return f.read()

@app.get("/favicon.ico")
async def favicon():
    # Stops the 404 favicon error
    return HTMLResponse(content="", status_code=204)

@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not resume.filename.endswith((".pdf", ".docx")):
        raise HTTPException(400, "Only PDF or DOCX files allowed.")

    if not job_description.strip():
        raise HTTPException(400, "Job description cannot be empty.")

    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    file_bytes = await resume.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large. Max size is 5MB.")

    try:
        resume_text = extract_text(file_bytes, resume.filename)
    except Exception as e:
        raise HTTPException(400, f"Could not read file: {str(e)}")

    if not resume_text:
        raise HTTPException(400, "Resume appears to be empty or unreadable.")

    try:
        result = analyze_resume(resume_text, job_description)
    except Exception as e:
        raise HTTPException(500, f"AI analysis failed: {str(e)}")

    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)