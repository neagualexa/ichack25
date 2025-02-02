from langchain_anthropic import ChatAnthropic
from browser_use import Agent
import asyncio
import os
from dotenv import load_dotenv
load_dotenv()

async def main():
    model = ChatAnthropic(model='claude-3-opus-20240229', api_key=os.environ.get("ANTHROPIC_API_KEY"))
    agent = Agent(
        task='You can search and click on the filters on the pages. Go to nike.com and and help me look for the following: for women clothes from nike club collection of size M. Return the url of the site you end up at in a json format. Such as {"url": "https://example.com/test"}',
        llm=model,
    )
    result = await agent.run()
    print('Result:: ', result.action_results())
    print('Result:: ', result.action_results()[-1])
    print('Result:: ', result.action_results()[-1].extracted_content)

asyncio.run(main())