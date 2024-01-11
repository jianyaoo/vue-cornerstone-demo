# wslink

Wslink allows easy, bi-directional communication between a python server and a
javascript client over a [websocket]. The client can make RPC calls to the
server, and the server can publish messages to topics that the client can
subscribe to. The server can include binary attachments in these messages,
which are communicated as a binary websocket message, avoiding the overhead of
encoding and decoding.

## RPC and publish/subscribe

The initial users of wslink driving its development are [VTK] and [ParaViewWeb].
ParaViewWeb and vtkWeb require:
* RPC - a remote procedure call that can be fired by the client and return
  sometime later with a response from the server, possibly an error.

* Publish/subscribe - client can subscribe to a topic provided by the server,
  possibly with a filter on the parts of interest. When the topic has updated
  results, the server publishes them to the client, without further action on
  the client's part.

## Get the whole story

This package is just the client side of wslink. See the [github repo] for 
the full story - and to contribute or report issues!

## License
Free to use in open-source and commercial projects, under the BSD-3-Clause license.

[github repo]: https://github.com/kitware/wslink
[ParaViewWeb]: https://www.paraview.org/web/
[VTK]: http://www.vtk.org/
[websocket]: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
