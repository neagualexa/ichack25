from langchain_anthropic import ChatAnthropic
from browser_use import Agent
import asyncio
import os
from dotenv import load_dotenv
load_dotenv()

async def main():
    model = ChatAnthropic(model='claude-3-opus-20240229', api_key=os.environ.get("ANTHROPIC_API_KEY"))
    agent = Agent(
        task="Go to Nike.com, click on 'Women', click on clothing, click on Size and select 'XS', return the number of items available",
        llm=model,
    )
    result = await agent.run()
    print(result)

asyncio.run(main())