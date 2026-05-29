import os
import google.generativeai as genai

# This line reads the secret key you saved in your terminal earlier
api_key = os.environ.get("GEMINI_API_KEY")

# This tells the Google tool to use your key
genai.configure(api_key=api_key)

# We select the model we want to use (gemini-1.5-pro is the recommended default)
model = genai.GenerativeModel("gemini-pro-latest")

# Here we send a simple prompt to the model
print("Sending request to Gemini...")
response = model.generate_content(
    "Hello! I am a UX Designer working on a new project. Can you give me 3 quick tips for designing AI interfaces?"
)
print("Response received!")

# This prints the response on your screen
print(response.text)
