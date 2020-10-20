import socketio
import math as Math
import random
import time
import sys

sio = socketio.Client()
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJRCI6InVpdWUtNnVpaHUtbml1NTYtbmlvNTQ2LW5vaTY0NS00MzVpdSIsIm93bmVySUQiOiI4OTg0MzU4ODA5Mzg0NTM0NTg5MzUifQ.OjQKim5GNF9SpgIk4IFQYlq0M6F6Hn6goKyKcQIgfhg'

class Device(object):
    def __init__(self):   
        sio.connect('http://localhost:3000')

    def login(self):
        sio.emit('login', token)
        info = 'someInfo'
        @sio.event
        def login_status_(status):
            if(status["code"] == 404):
                print(status["error"])
            elif(status["code"] == 200):
                print(status["device"]["name"], " - Login Successfull")
                print(status["device"]["lastOnline"])
                print("REGION : ", status["device"]["region"])
                print("IP (on server) : ", status["device"]["ip"])
                nonlocal info
                info = status["device"]
                return info
        return info

    def publish(self, feed, data):   
        sio.emit('publish', {
            "deviceID": "uiud-6uihu-niu56-nio546-noi645-435iu",
            "feed": feed,
            "content": data,
            "authorId": "uiue-6uihu-niu56-nio546-noi645-435iu",
            "isDevice": True,
            "timeStamp": time.time()
            })


device = Device()

print(device.login())

@sio.event
def somerandomfeed(msg):
    print(msg["content"])

@sio.event
def disconnect():
    sys.exit('Disconnected from server')

#device.publish("somerandomfeed", 'hehe')

#sio.wait()
