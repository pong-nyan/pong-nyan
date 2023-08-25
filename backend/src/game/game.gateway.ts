import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { GameService } from "./game.service";

@WebSocketGateway({
  cors: { origin: "*" },
  path: "/socket/",
})
export class GameGateway {
  constructor(private service: GameService) {}

  @WebSocketServer()
  server: Server;
  fps = 1000 / 60;

  @SubscribeMessage("ball")
  handleBall(client: Socket, data: any) {
    client.broadcast.emit("ball", data);
  }

  @SubscribeMessage("startGame")
  handleStartGame(client: Socket, data: any) {
    console.log("startGame");
    const ret = this.service.match(client);
    const roomName = ret?.roomName;
    const p1 = ret?.p1;
    if (!roomName) this.server.to(client.id).emit("loading");
    this.server.to(roomName).emit("start", p1);
  }

  @SubscribeMessage("gameEvent")
  handleGameEvent(client: Socket, data: any) {
    console.log("gameEvent");
    console.log("data:", data);
  }
}
