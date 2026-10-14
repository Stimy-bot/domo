import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";


export class Client {
  constructor() {
  }
}

let _client_instance;

export function ref() {
  if (!_client_instance) {
    _client_instance = new Client();
  }
  return _client_instance;
}
