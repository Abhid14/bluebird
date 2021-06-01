import os
import asyncio
import websockets
from pymsgbox import *

async def handler(websocket, path):
    while True:
        try:
            message = await websocket.recv()
            if message:
                eval(r"os.startfile(r'{}\{}\{}.lnk')".format(
                    os.getcwd(), message, message))
                await websocket.send("appstarted")
        except:
            alert(text='Blue Bird server is not connected to plugin and will now exit. Please restart the server and plugin to use.', title='Blue Bird')
            exit()
start_server = websockets.serve(handler, "127.0.0.1", 5678)
asyncio.get_event_loop().run_until_complete(start_server)
alert(text='Blue Bird server is now active start Lively Wallpaper or enable plugin from menu!', title='Blue Bird')
asyncio.get_event_loop().run_forever()
