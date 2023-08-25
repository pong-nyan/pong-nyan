import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway({
  cors: { origin: "*" },
  path: "/socket/",
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  async handleConnection(client: Socket) {
    console.log("Connection", client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log("Disconnection");
  }
}
