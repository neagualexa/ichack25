from flask import Flask, jsonify, request
import asyncio
import os
import requests
from dotenv import load_dotenv
from langchain_anthropic import ChatAnthropic
from browser_use import Agent
from flask_cors import CORS, cross_origin

load_dotenv()

app = Flask(__name__)
CORS(app) 

@app.route('/run-task', methods=['POST'])
@cross_origin()
def run_agent():
    task = request.json.get('task')
    async def main():
        model = ChatAnthropic(model='claude-3-opus-20240229', api_key=os.environ.get("ANTHROPIC_API_KEY"))
        agent = Agent(
            task=task,
            llm=model,
        )
        result = await agent.run()
        return result

    result = asyncio.run(main())
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=3000)