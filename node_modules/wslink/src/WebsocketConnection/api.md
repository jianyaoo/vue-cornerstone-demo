# WebsocketConnection

## WebsocketConnection.newInstance({ urls })

Create an instance of a websocket connection. The urls should
be a single url (string).

Usually with a ProcessLauncher we will set the **urls** to **connection.sessionURL**.

The input can optionally include a string to autheticate the 
connection during the handshake: `{ urls, secret:"wslink-secret" }`

## connect() 

Trigger the actual connection request with the server.

## onConnectionReady(callback) : subscription

Register callback for when the connection became ready.

## onConnectionClose(callback) : subscription

Register callback for when the connection close.

## getSession() : object

Return null if the connection is not yet established or the session
for making RPC calls.

## destroy(timeout=10)

Close the connection and ask the server to automaticaly shutdown after the given timeout while removing any listener.

If the provided timeout is negative, we will close the connection without asking the server to shutdown.
