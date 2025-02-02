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
    pages = request.json.get('page_input') 
    task = request.json.get('task_input') 
    
    def getPages(pages_info):
        model = ChatAnthropic(model='claude-3-opus-20240229', api_key=os.environ.get("ANTHROPIC_API_KEY"))
        ai_task = 'Structure the following website names into a list: ' + pages_info + '. Return the list format. Such as ["WebsiteA", "WebsiteB"]'
        print('AI TASK getPages:: ', ai_task)
        result_pages = model.invoke(ai_task) # this is a string, must be converted to list
        result_pages = result_pages.content.replace(']', '').replace('[', '').replace('"', '').split(',')
        print('Result Pages:: ', result_pages)
        return result_pages
    
    async def main(page):
        model = ChatAnthropic(model='claude-3-opus-20240229', api_key=os.environ.get("ANTHROPIC_API_KEY"))
        ai_task = 'You can search and click on the filters on the pages. '+ \
            'Open the page: '+ page + ' .com and help me look for the following: ' + task + \
        '. Accept all cookies. Return the url in a json format. Such as {"url": "https://example.com/test"}'
        agent = Agent(
            task=ai_task,
            llm=model,
            retry_delay=20,
            max_failures=5
        )
        result = await agent.run()
        return result
    
    list_pages = getPages(pages)

    url_pages = []
    for page in list_pages:
        result = asyncio.run(main(page))
        print('ALL OUT:: ', result)
        print('All Results:: ', result.action_results())
        final_data = result.action_results()[-1].extracted_content
        url_pages.append(final_data)
        
    return jsonify(url_pages)

if __name__ == '__main__':
    app.run(port=3000)