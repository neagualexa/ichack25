from dotenv import load_dotenv
import anthropic
import os

# load .env file
load_dotenv(dotenv_path='.env')

key = os.environ.get("ANTHROPIC_API_KEY")

client = anthropic.Anthropic(
    api_key=key,
)
message = client.messages.create(
    model=os.environ.get("ANTHROPIC_MODEL_ID"),
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)
print(message.content)
