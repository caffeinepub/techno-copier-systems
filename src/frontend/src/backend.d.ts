import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface SalesOrder {
    id: bigint;
    customerName: string;
    customerPhone: string;
    orderDate: Time;
    orderType: OrderType;
    customerAddress: string;
    notes: string;
    itemName: string;
    quantity: bigint;
}
export interface RentalAgreement {
    id: bigint;
    customerName: string;
    status: RentalStatus;
    endDate: Time;
    customerPhone: string;
    createdAt: Time;
    customerAddress: string;
    notes: string;
    machineSerial: string;
    monthlyFee: bigint;
    machineType: string;
    startDate: Time;
}
export interface ServiceJob {
    id: bigint;
    customerName: string;
    status: ServiceJobStatus;
    assignedTo: string;
    issueDescription: string;
    customerPhone: string;
    createdAt: Time;
    updatedAt: Time;
    customerAddress: string;
    machineType: string;
}
export interface CallLog {
    id: bigint;
    customerName: string;
    status: CallStatus;
    customerPhone: string;
    createdAt: Time;
    callType: CallType;
    customerAddress: string;
    requirement: string;
    notes: string;
}
export interface DashboardStats {
    totalOrders: bigint;
    activeRentals: bigint;
    openServiceJobs: bigint;
    openCalls: bigint;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum CallStatus {
    closed = "closed",
    open = "open",
    followUp = "followUp"
}
export enum CallType {
    serviceEnquiry = "serviceEnquiry",
    general = "general",
    salesEnquiry = "salesEnquiry"
}
export enum OrderType {
    consumable = "consumable",
    machineSale = "machineSale"
}
export enum RentalStatus {
    active = "active",
    upcoming = "upcoming",
    expired = "expired"
}
export enum ServiceJobStatus {
    delayed = "delayed",
    done = "done",
    inTransit = "inTransit",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCallLog(customerName: string, customerAddress: string, customerPhone: string, requirement: string, callType: CallType, notes: string): Promise<bigint>;
    createRental(customerName: string, customerAddress: string, customerPhone: string, machineType: string, machineSerial: string, startDate: Time, endDate: Time, monthlyFee: bigint, notes: string): Promise<bigint>;
    createSalesOrder(customerName: string, customerAddress: string, customerPhone: string, orderType: OrderType, itemName: string, quantity: bigint, notes: string): Promise<bigint>;
    createServiceJob(customerName: string, customerAddress: string, customerPhone: string, machineType: string, issueDescription: string, assignedTo: string): Promise<bigint>;
    deleteCallLog(id: bigint): Promise<void>;
    deleteRental(id: bigint): Promise<void>;
    deleteSalesOrder(id: bigint): Promise<void>;
    deleteServiceJob(id: bigint): Promise<void>;
    getAllCallLogs(): Promise<Array<CallLog>>;
    getAllRentals(): Promise<Array<RentalAgreement>>;
    getAllSalesOrders(): Promise<Array<SalesOrder>>;
    getAllServiceJobs(): Promise<Array<ServiceJob>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallsByStatus(status: CallStatus): Promise<Array<CallLog>>;
    getDashboardStats(): Promise<DashboardStats>;
    getRentalsByStatus(status: RentalStatus): Promise<Array<RentalAgreement>>;
    getServiceJobsByStatus(status: ServiceJobStatus): Promise<Array<ServiceJob>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    readCallLog(id: bigint): Promise<CallLog | null>;
    readRental(id: bigint): Promise<RentalAgreement | null>;
    readSalesOrder(id: bigint): Promise<SalesOrder | null>;
    readServiceJob(id: bigint): Promise<ServiceJob | null>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCallStatus(id: bigint, status: CallStatus): Promise<void>;
    updateRentalStatus(id: bigint, status: RentalStatus): Promise<void>;
    updateServiceJob(id: bigint, status: ServiceJobStatus): Promise<void>;
}
