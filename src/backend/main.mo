import Map "mo:core/Map";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    role : Text; // "Admin" or "Staff"
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Service Jobs Types
  type ServiceJobStatus = {
    #inTransit;
    #inProgress;
    #done;
    #delayed;
  };

  type ServiceJob = {
    id : Nat;
    customerName : Text;
    customerAddress : Text;
    customerPhone : Text;
    machineType : Text;
    issueDescription : Text;
    status : ServiceJobStatus;
    assignedTo : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  module ServiceJob {
    public func compare(sj1 : ServiceJob, sj2 : ServiceJob) : Order.Order {
      Nat.compare(sj1.id, sj2.id);
    };
  };

  // Rental Types
  type RentalStatus = {
    #active;
    #expired;
    #upcoming;
  };

  type RentalAgreement = {
    id : Nat;
    customerName : Text;
    customerAddress : Text;
    customerPhone : Text;
    machineType : Text;
    machineSerial : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    monthlyFee : Nat;
    status : RentalStatus;
    notes : Text;
    createdAt : Time.Time;
  };

  module RentalAgreement {
    public func compare(r1 : RentalAgreement, r2 : RentalAgreement) : Order.Order {
      Nat.compare(r1.id, r2.id);
    };
  };

  // Sales Orders Types
  type OrderType = {
    #machineSale;
    #consumable;
  };

  type SalesOrder = {
    id : Nat;
    customerName : Text;
    customerAddress : Text;
    customerPhone : Text;
    orderType : OrderType;
    itemName : Text;
    quantity : Nat;
    orderDate : Time.Time;
    notes : Text;
  };

  module SalesOrder {
    public func compare(s1 : SalesOrder, s2 : SalesOrder) : Order.Order {
      Nat.compare(s1.id, s2.id);
    };
  };

  // Call Logs Types
  type CallType = {
    #serviceEnquiry;
    #salesEnquiry;
    #general;
  };
  type CallStatus = {
    #open;
    #followUp;
    #closed;
  };

  type CallLog = {
    id : Nat;
    customerName : Text;
    customerAddress : Text;
    customerPhone : Text;
    requirement : Text;
    callType : CallType;
    status : CallStatus;
    notes : Text;
    createdAt : Time.Time;
  };

  module CallLog {
    public func compare(c1 : CallLog, c2 : CallLog) : Order.Order {
      Nat.compare(c1.id, c2.id);
    };
  };

  // Dashboard Stats Type
  public type DashboardStats = {
    activeRentals : Nat;
    openServiceJobs : Nat;
    openCalls : Nat;
    totalOrders : Nat;
  };

  // Repositories
  let serviceJobMap = Map.empty<Nat, ServiceJob>();
  let rentalMap = Map.empty<Nat, RentalAgreement>();
  let orderMap = Map.empty<Nat, SalesOrder>();
  let callLogMap = Map.empty<Nat, CallLog>();

  var nextServiceJobId = 1;
  var nextRentalId = 1;
  var nextOrderId = 1;
  var nextCallLogId = 1;

  // Service Jobs CRUD
  public shared ({ caller }) func createServiceJob(customerName : Text, customerAddress : Text, customerPhone : Text, machineType : Text, issueDescription : Text, assignedTo : Text) : async Nat {
    // Staff can create service jobs (operational task)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can create service jobs");
    };

    let id = nextServiceJobId;
    nextServiceJobId += 1;

    let job : ServiceJob = {
      id;
      customerName;
      customerAddress;
      customerPhone;
      machineType;
      issueDescription;
      status = #inTransit;
      assignedTo;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    serviceJobMap.add(id, job);
    id;
  };

  public query ({ caller }) func readServiceJob(id : Nat) : async ?ServiceJob {
    // Staff can read
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can read service jobs");
    };
    serviceJobMap.get(id);
  };

  public shared ({ caller }) func updateServiceJob(id : Nat, status : ServiceJobStatus) : async () {
    // Staff can update status
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can update service jobs");
    };

    switch (serviceJobMap.get(id)) {
      case (null) { Runtime.trap("Service job not found") };
      case (?job) {
        let updatedJob = {
          job with
          status;
          updatedAt = Time.now();
        };
        serviceJobMap.add(id, updatedJob);
      };
    };
  };

  public shared ({ caller }) func deleteServiceJob(id : Nat) : async () {
    // Only admin can delete
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete service jobs");
    };
    serviceJobMap.remove(id);
  };

  public query ({ caller }) func getServiceJobsByStatus(status : ServiceJobStatus) : async [ServiceJob] {
    // Staff can read
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can read service jobs");
    };
    serviceJobMap.values().toArray().filter(func(job) { job.status == status }).sort();
  };

  public query ({ caller }) func getAllServiceJobs() : async [ServiceJob] {
    // Staff can read
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can read service jobs");
    };
    serviceJobMap.values().toArray().sort();
  };

  // Rental Agreements CRUD
  public shared ({ caller }) func createRental(customerName : Text, customerAddress : Text, customerPhone : Text, machineType : Text, machineSerial : Text, startDate : Time.Time, endDate : Time.Time, monthlyFee : Nat, notes : Text) : async Nat {
    // Only admin can create rentals
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create rental agreements");
    };

    let id = nextRentalId;
    nextRentalId += 1;

    let rental : RentalAgreement = {
      id;
      customerName;
      customerAddress;
      customerPhone;
      machineType;
      machineSerial;
      startDate;
      endDate;
      monthlyFee;
      status = #upcoming;
      notes;
      createdAt = Time.now();
    };

    rentalMap.add(id, rental);
    id;
  };

  public query ({ caller }) func readRental(id : Nat) : async ?RentalAgreement {
    // Staff can read
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can read rental agreements");
    };
    rentalMap.get(id);
  };

  public shared ({ caller }) func updateRentalStatus(id : Nat, status : RentalStatus) : async () {
    // Staff can update status
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can update rental status");
    };

    switch (rentalMap.get(id)) {
      case (null) { Runtime.trap("Rental not found") };
      case (?rental) {
        let updatedRental = {
          rental with
          status;
        };
        rentalMap.add(id, updatedRental);
      };
    };
  };

  public shared ({ caller }) func deleteRental(id : Nat) : async () {
    // Only admin can delete
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete rental agreements");
    };
    rentalMap.remove(id);
  };

  public query ({ caller }) func getRentalsByStatus(status : RentalStatus) : async [RentalAgreement] {
    // Staff can read
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can read rental agreements");
    };
    rentalMap.values().toArray().filter(func(rental) { rental.status == status }).sort();
  };

  public query ({ caller }) func getAllRentals() : async [RentalAgreement] {
    // Staff can read
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can read rental agreements");
    };
    rentalMap.values().toArray().sort();
  };

  // Sales Orders CRUD
  public shared ({ caller }) func createSalesOrder(customerName : Text, customerAddress : Text, customerPhone : Text, orderType : OrderType, itemName : Text, quantity : Nat, notes : Text) : async Nat {
    // Only admin can create sales orders
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create sales orders");
    };

    let id = nextOrderId;
    nextOrderId += 1;

    let order : SalesOrder = {
      id;
      customerName;
      customerAddress;
      customerPhone;
      orderType;
      itemName;
      quantity;
      orderDate = Time.now();
      notes;
    };

    orderMap.add(id, order);
    id;
  };

  public query ({ caller }) func readSalesOrder(id : Nat) : async ?SalesOrder {
    // Staff can read
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can read sales orders");
    };
    orderMap.get(id);
  };

  public shared ({ caller }) func deleteSalesOrder(id : Nat) : async () {
    // Only admin can delete
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete sales orders");
    };
    orderMap.remove(id);
  };

  public query ({ caller }) func getAllSalesOrders() : async [SalesOrder] {
    // Staff can read
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can read sales orders");
    };
    orderMap.values().toArray().sort();
  };

  // Call Logs CRUD
  public shared ({ caller }) func createCallLog(customerName : Text, customerAddress : Text, customerPhone : Text, requirement : Text, callType : CallType, notes : Text) : async Nat {
    // Staff can create call logs (operational task)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can create call logs");
    };

    let id = nextCallLogId;
    nextCallLogId += 1;

    let callLog : CallLog = {
      id;
      customerName;
      customerAddress;
      customerPhone;
      requirement;
      callType;
      status = #open;
      notes;
      createdAt = Time.now();
    };

    callLogMap.add(id, callLog);
    id;
  };

  public query ({ caller }) func readCallLog(id : Nat) : async ?CallLog {
    // Staff can read
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can read call logs");
    };
    callLogMap.get(id);
  };

  public shared ({ caller }) func updateCallStatus(id : Nat, status : CallStatus) : async () {
    // Staff can update status
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can update call status");
    };

    switch (callLogMap.get(id)) {
      case (null) { Runtime.trap("Call log not found") };
      case (?log) {
        let updatedLog = {
          log with
          status;
        };
        callLogMap.add(id, updatedLog);
      };
    };
  };

  public shared ({ caller }) func deleteCallLog(id : Nat) : async () {
    // Only admin can delete
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete call logs");
    };
    callLogMap.remove(id);
  };

  public query ({ caller }) func getCallsByStatus(status : CallStatus) : async [CallLog] {
    // Staff can read
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can read call logs");
    };
    callLogMap.values().toArray().filter(func(log) { log.status == status }).sort();
  };

  public query ({ caller }) func getAllCallLogs() : async [CallLog] {
    // Staff can read
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can read call logs");
    };
    callLogMap.values().toArray().sort();
  };

  // Dashboard Stats
  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    // Staff can read dashboard
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can view dashboard stats");
    };

    let activeRentals = rentalMap.values().toArray().filter(func(r) { r.status == #active }).size();
    let openServiceJobs = serviceJobMap.values().toArray().filter(func(j) { j.status != #done }).size();
    let openCalls = callLogMap.values().toArray().filter(func(c) { c.status == #open or c.status == #followUp }).size();
    let totalOrders = orderMap.size();

    {
      activeRentals;
      openServiceJobs;
      openCalls;
      totalOrders;
    };
  };
};
