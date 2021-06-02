import os
import asyncio
import websockets
import websockets.legacy
from pymsgbox import *
async def handler(websocket, path):
    try:
        while True:
            message = await websocket.recv()
            if message:
                try:
                    eval(r"os.startfile(r'{}\userassets\appslibrary\{}\{}.lnk')".format(os.getcwd(), message, message))
                    await websocket.send("appstarted")
                except:
                    alert(text="Error! Bluebird couldn't find the shortcut to your app please check the folder for missing files!", title='Bluebird')
    except:
        sys.exit()

start_server = websockets.serve(handler, "127.0.0.1", 20216)
asyncio.get_event_loop().run_until_complete(start_server)
alert(text='Blubird server is now active start Lively Wallpaper or enable plugin from menu!', title='Bluebird')
asyncio.get_event_loop().run_forever()
exit()
