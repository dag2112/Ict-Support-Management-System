import { PrismaClient, Role, Urgency, RequestStatus, AssetStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const userData = [
    { name: "Abebe Kebede",  email: "abebe@woldia.edu.et",  password: "Abebe@1234",  role: Role.REQUESTER,  department: "Engineering" },
    { name: "Yonas Tesfaye", email: "yonas@woldia.edu.et",  password: "Yonas@1234",  role: Role.TECHNICIAN, department: "ICT" },
    { name: "Meron Alemu",   email: "meron@woldia.edu.et",  password: "Meron@1234",  role: Role.MANAGER,    department: "ICT" },
    { name: "Admin User",    email: "admin@woldia.edu.et",  password: "Admin@1234",  role: Role.ADMIN,      department: "ICT" },
  ];

  const users = await Promise.all(
    userData.map(async (u) => {
      const hashed = await bcrypt.hash(u.password, 10);
      return prisma.user.upsert({
        where: { email: u.email },
        update: { password: hashed, role: u.role },
        create: { ...u, password: hashed },
      });
    })
  );

  const [requester, technician, manager] = users;

  const req1 = await prisma.supportRequest.upsert({
    where: { requestNumber: "REQ-001" },
    update: {},
    create: {
      requestNumber: "REQ-001",
      title: "Laptop screen not working",
      description: "The screen flickers and goes black after 5 minutes.",
      issueType: "Hardware",
      urgency: Urgency.HIGH,
      status: RequestStatus.ASSIGNED,
      submittedById: requester.id,
      assignedToId: technician.id,
      approvedById: manager.id,
      location: "Admin Block",
    },
  });

  await prisma.supportRequest.upsert({
    where: { requestNumber: "REQ-002" },
    update: {},
    create: {
      requestNumber: "REQ-002",
      title: "Cannot connect to university WiFi",
      description: "Getting authentication error when connecting to campus network.",
      issueType: "Network",
      urgency: Urgency.MEDIUM,
      status: RequestStatus.PENDING,
      submittedById: requester.id,
      location: "Library",
    },
  });

  await prisma.supportRequest.upsert({
    where: { requestNumber: "REQ-003" },
    update: {},
    create: {
      requestNumber: "REQ-003",
      title: "Printer not printing",
      description: "Office printer shows offline status.",
      issueType: "Hardware",
      urgency: Urgency.LOW,
      status: RequestStatus.FIXED,
      submittedById: requester.id,
      assignedToId: technician.id,
      approvedById: manager.id,
      resolutionNote: "Replaced printer cable and updated driver.",
      location: "Office 101",
    },
  });

  const assetData = [
    { assetNumber: "AST-001", type: "Laptop",  model: "Dell Latitude 5520",  serialNumber: "DL5520-001",   location: "Admin Block",  status: AssetStatus.ACTIVE },
    { assetNumber: "AST-002", type: "Printer", model: "HP LaserJet Pro",     serialNumber: "HPLJ-002",     location: "Library",      status: AssetStatus.UNDER_MAINTENANCE },
    { assetNumber: "AST-003", type: "Server",  model: "Dell PowerEdge R740", serialNumber: "DPER740-001",  location: "Server Room",  status: AssetStatus.ACTIVE },
    { assetNumber: "AST-004", type: "Desktop", model: "HP EliteDesk 800",    serialNumber: "HPED-004",     location: "Lab 1",        status: AssetStatus.FAULTY },
  ];

  for (const asset of assetData) {
    await prisma.asset.upsert({
      where: { assetNumber: asset.assetNumber },
      update: {},
      create: asset,
    });
  }

  console.log("Seeding complete.");
  console.log("Accounts:");
  console.log("  abebe@woldia.edu.et  → Abebe@1234  (Requester)");
  console.log("  yonas@woldia.edu.et  → Yonas@1234  (Technician)");
  console.log("  meron@woldia.edu.et  → Meron@1234  (Manager)");
  console.log("  admin@woldia.edu.et  → Admin@1234  (Admin)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
