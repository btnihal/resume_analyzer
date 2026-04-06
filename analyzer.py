
from groq import Groq
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_resume(resume_text: str, job_description: str) -> dict:

    prompt = f"""
You are an expert HR consultant and ATS specialist.

Analyze the resume below against the job description and return a JSON response with EXACTLY this structure:
{{
  "ats_score": <number 0-100>,
  "skills_found": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "summary": "<2-3 sentence professional summary>",
  "improvements": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "strengths": ["strength1", "strength2", "strength3"],
  "verdict": "<Strong Match | Good Match | Partial Match | Weak Match>"
}}

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

IMPORTANT: Return ONLY raw JSON. No markdown, no backticks, no explanation.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # Free & powerful
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500
    )

    raw = response.choices[0].message.content.strip()

    match = re.search(r'\{.*\}', raw, re.DOTALL)
    if not match:
        raise ValueError(f"Did not return valid JSON. Got: {raw[:200]}")

    return json.loads(match.group())