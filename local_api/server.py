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
    page = request.json.get('page_input') 
    task = request.json.get('task_input') 
    check_only_main_page = request.json.get('toggle_task')
    
    if check_only_main_page:
        ai_task = 'Open the page: '+ page + ' .com. Accept all cookies. Return the url in a json format. Such as {"url": "https://example.com/test"}'
    else:
        ai_task = 'Open the page: '+ page + ' .com and Search for ' + task + \
        '. Accept all cookies. Return the url in a json format. Such as {"url": "https://example.com/test"}'
    async def main():
        model = ChatAnthropic(model='claude-3-opus-20240229', api_key=os.environ.get("ANTHROPIC_API_KEY"))
        agent = Agent(
            task=ai_task,
            llm=model,
        )
        result = await agent.run()
        return result

    result = asyncio.run(main())
    print('ALL OUT:: ', result)
    print('All Results:: ', result.action_results())
    return jsonify(result.action_results()[-1].extracted_content)

if __name__ == '__main__':
    app.run(port=3000)