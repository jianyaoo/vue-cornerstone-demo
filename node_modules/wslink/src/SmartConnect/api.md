# SmartConnect

SmartConnect will try to launch a new remote process
based on the configuration and if that fails or if
a sessionURL is already provided in the configuration
it will establish a direct WebSocket connection using
Autobahn.

## SmartConnect.newInstance({ config })

Create an instance that will use the provided configuration to
connect itself to a server either by requesting a new remote
process or by trying to directly connecting to it as a fallback.

## connect()

Trigger the connection request.

## onConnectionReady(callback) : subscription

Register callback for when the connection became ready.

## onConnectionClose(callback) : subscription

Register callback for when the connection close.  Callback takes
two arguments, the connection object and a websocket event.
If the server closes the connection after sending a close frame
(https://datatracker.ietf.org/doc/html/rfc6455#section-5.5.1), the event
will have the shape {code: number, reason: string}.

## onConnectionError(callback) : subscription

Register callback for when the connection request failed.
Callback takes two arguments, the connection object and a websocket event.

## getSession() : session

Return the session associated with the connection.

## destroy()

Free resources and remove any listener.
