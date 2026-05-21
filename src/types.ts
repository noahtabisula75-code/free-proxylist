export interface ProxyData {
  _id: string;
  ip: string;
  port: string | number;
  country: string;
  speed?: number;
  latency?: number;
  protocols: string[];
  anonymityLevel?: string;
  upTime?: number;
  lastChecked?: number;
}

export interface ProxyListResponse {
  data: ProxyData[];
  total: number;
  page: number;
  limit: number;
}
