import type { GameConnection } from "./game/GameConnection";

export const KEY_GET_CONNECTION = "get_connection";
export type TYPE_GET_CONNECTION = () => GameConnection;

export const KEY_APPEND_MESSAGE = "append_message";
export type TYPE_APPEND_MESSAGE = (message: String) => void;

export const KEY_APPEND_COMMAND = "append_command";
export type TYPE_APPEND_COMMAND = (command: String) => void;