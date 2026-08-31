import { api } from "@/lib/config";
import {
  PURCHASE_ORDER,
  type GetPurchaseOrdersProps,
  type PurchaseOrderResource,
  type PurchaseOrderResourceById,
  type PurchaseOrderResponse,
  type CreatePurchaseOrderRequest,
  type UpdatePurchaseOrderRequest,
  type PurchaseOrderDetailResponse,
  type PurchaseOrderDetailResourceById,
  type CreatePurchaseOrderDetailRequestFull,
  type UpdatePurchaseOrderDetailRequest,
  type GetPurchaseOrderDetailsProps,
} from "./purchase-order.interface";
import type { AxiosRequestConfig } from "axios";
import { DEFAULT_PER_PAGE } from "@/lib/core.constants";

const { ENDPOINT } = PURCHASE_ORDER;

// Purchase Order CRUD
export async function getPurchaseOrders({
  params,
}: GetPurchaseOrdersProps): Promise<PurchaseOrderResponse> {
  const config: AxiosRequestConfig = {
    params: {
      per_page: DEFAULT_PER_PAGE,
      ...params,
    },
  };
  const { data } = await api.get<PurchaseOrderResponse>(ENDPOINT, config);
  return data;
}

export async function getAllPurchaseOrders(): Promise<PurchaseOrderResource[]> {
  const config: AxiosRequestConfig = {
    params: {
      all: true,
    },
  };
  const { data } = await api.get<PurchaseOrderResource[]>(ENDPOINT, config);
  return data;
}

export async function findPurchaseOrderById(
  id: number
): Promise<PurchaseOrderResourceById> {
  const response = await api.get<PurchaseOrderResourceById>(`${ENDPOINT}/${id}`);
  return response.data;
}

export async function storePurchaseOrder(
  data: CreatePurchaseOrderRequest
): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(ENDPOINT, data);
  return response.data;
}

export async function updatePurchaseOrder(
  id: number,
  data: UpdatePurchaseOrderRequest
): Promise<{ message: string }> {
  const response = await api.put<{ message: string }>(`${ENDPOINT}/${id}`, data);
  return response.data;
}

export async function deletePurchaseOrder(
  id: number
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`${ENDPOINT}/${id}`);
  return data;
}

// Purchase Order Details CRUD
export async function getPurchaseOrderDetails({
  purchaseOrderId,
  params,
}: GetPurchaseOrderDetailsProps): Promise<PurchaseOrderDetailResponse> {
  const config: AxiosRequestConfig = {
    params: {
      ...params,
      per_page: DEFAULT_PER_PAGE,
    },
  };
  const { data } = await api.get<PurchaseOrderDetailResponse>(
    `/purchaseorderdetail?purchase_order_id=${purchaseOrderId}`,
    config
  );
  return data;
}

export async function getPurchaseOrderDetailById(
  id: number
): Promise<PurchaseOrderDetailResourceById> {
  const response = await api.get<PurchaseOrderDetailResourceById>(
    `/purchaseorderdetail/${id}`
  );
  return response.data;
}

export async function createPurchaseOrderDetail(
  request: CreatePurchaseOrderDetailRequestFull
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    "/purchaseorderdetail",
    request
  );
  return data;
}

export async function updatePurchaseOrderDetail(
  id: number,
  request: UpdatePurchaseOrderDetailRequest
): Promise<{ message: string }> {
  const { data } = await api.put<{ message: string }>(
    `/purchaseorderdetail/${id}`,
    request
  );
  return data;
}

export async function deletePurchaseOrderDetail(
  id: number
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(
    `/purchaseorderdetail/${id}`
  );
  return data;
}
