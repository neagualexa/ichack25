from flask import Flask, jsonify, request
import asyncio
import os
import requests
from dotenv import load_dotenv
from browser_use import Agent
from langchain import ChatAnthropic

load_dotenv()

app = Flask(__name__)

@app.route('/run-task', methods=['POST'])
def run_agent():
    task = request.json.get('task')
    async def main():
        model = ChatAnthropic(model='claude-3-opus-20240229', api_key=os.environ.get("ANTHROPIC_API_KEY"))
        agent = Agent(
            task="Go to Nike.com, click on 'Women', click on clothing, click on Size and select 'XS', return the number of items available",
            llm=model,
        )
        result = await agent.run()
        return result

    result = asyncio.run(main())
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=3000)