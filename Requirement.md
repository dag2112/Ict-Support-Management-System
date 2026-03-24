

 
WOLDIA UNIVERSITY
INSTITUTE OF TECHNOLOGY SCHOOL OF COMPUTING
DEPARTMENT OF SOFTWARE ENGINEERING
Project Title: Ict Support Management System
A Senior Project Documentation Submitted to Woldia University in Partial Fulfillment of the Requirement for the Degree of Bachelor of Science in Software Engineering             Group members:                                                 id:
1.	Dagim W/kidan                                                 1304693
2.	Geleta Bekele                                                           1301323
3.	Kaleb Teshome                                                        1301696
4.	Kaleb Melaku                                                    1301697
5.	Kaleab Bayeh                                                    1301691
                        
                                                                                        Advisor: Abiot 
                       
                                                                                       Submission Date :9/5/2018
                                                                                        Woldia , Ethiopia



                                                        Approval
Name	Signature	Date
__________________________	__________________________	__________________
__________________________	__________________________	__________________
__________________________	__________________________	__________________
__________________________	__________________________	__________________























Acknowledgements
We would like to express our sincere gratitude to Mr. Abiot for his valuable guidance, support, and continuous encouragement throughout the preparation of this Software Requirements Specification (SRS) document. His insightful suggestions and constructive feedback greatly helped us understand the proper structure and content required for a professional system documentation.
We are also thankful for his patience and dedication in guiding us step by step, ensuring that we followed the correct procedures and standards in preparing this document. His assistance has played a significant role in improving the quality of our work.
Finally, we extend our appreciation to everyone who contributed directly or indirectly to the successful completion of this SRS document.























ABSTRACT
The ICT Support and Management Platform is designed to streamline the management of service requests and enhance the efficiency of support processes within organizations. This platform aims to automate the request submission, approval, technician assignment, fulfillment, and feedback collection processes. The system provides a user-friendly interface for submitting and tracking requests while ensuring that all tasks are managed systematically. The platform integrates various modules including request management, approval workflows, technician assignment, and performance reporting. It also incorporates escalation and spare part management to address complex issues.
By incorporating real-time notifications, automated feedback collection, and data-driven decision-making tools, the platform enhances communication between users, approvers, managers, and technicians. The system ultimately improves service delivery, promotes transparency, and boosts user satisfaction by ensuring that service requests are addressed efficiently and effectively. This platform is particularly useful for organizations aiming to improve their ICT support systems by replacing traditional, manual, and inefficient methods with an automated and integrated solution.













Contents
CHAPTER ONE: 1. INTRODUCTION	8
1.1 Project Overview	8
1.2 Problem Statement	9
1.3 Project Objectives	9
1.3.1 General Objective	9
1.3.2 Specific Objectives	9
1.4 Scope and Limitations	10
1.5 Project Significance	10
1.6 Project Beneficiaries	10
1.7 Feasibility Study	11
1.7.1 Operational Feasibility	11
1.7.2 Economic Feasibility	11
1.7.3 Social Feasibility	11
1.8 Methodology	12
1.8.1 Data Collection Methodology	12
1.9 System Analysis and Design	12
1.9.1 System Analysis Using Role-Based Interviews	13
1.9.2 System Design and Implementation Approach	13
1.9.3 Testing Methodology	14
1.9.4 Deployment Methodology	15
1.9.5 Security Methodology	16
1.10 System Development	16
1.11 Development Tools	17
1.12 Team Roles and Responsibilities	17
Chapter Two: Analysis of the current system	18
2.1 Description of the Current System	19
2.2 Overview of the Current System	19
2.3 Structure of the Existing System	20
2.3.1 Users	20
2.3.2 Approval and Administration	20
2.3.3 ICT Directorate and Technicians	20
Chapter Three: Software Requirements Specification	22
3.1 Proposed System Overview	22
3.2 Functional Requirements (FR)	22
FR-13: Notification Management	24
FR-14: Searching and Filtering	24
FR-15: Asset and Equipment Management	25
3.3 Non-Functional Requirements (NFR)	25
3.4 Use Case Models	26
3.4.1 Use Case Diagram	26
3.4.2 Activity diagram	37
3.4.3 Sequence Diagram	48
3.4.4 Class diagram	54
Chapter Four: System Design	57
4.1 Introduction	58
4.2 Purpose of the System Design Document (SDD)	58
4.3 Design Goals	59
4.4 Current Software Architecture	60
4.5 Proposed Software Architecture	60
4.5.1 Overview	60
4.5.2 Subsystem Decomposition	60
4.5.3 Hardware / Software Mapping	61
4.5.4 Database Design	61
4.5.5 Access Control and Security	62
4.5.6 Boundary Conditions	62
4.6 User Interface Design	62
4.6.1 Navigational Paths	62
4.6.2 Screen Mock-ups	63









Figure 1:usecase diagram for the system	25
Figure 2:Activity diagram for login	35
Figure 3:Activity diagram for user registration	36
Figure 4: Activity diagram for request submission	37
Figure 5:Activity diagram for approve or reject a request.	38
Figure 6:Activity diagram for assign technician	39
Figure 7:Activity diagram for fill request status	40
Figure 8:Activity diagram for approve a spare request.	41
Figure 9:Activity diagram for view spare request	42
Figure 10:Activity diagram for send feedback.	43
Figura 11:Activity diagram for view report.	44
Figura 12: Sequence Diagram for login	45
Figure 13:Sequence Diagram for user registration.	46
Figura 14: Sequence Diagram for request submission.	47
Figure 15:Sequence Diagram for fill request status.	48
Figure 16: Sequence Diagram for assigning a technician.	49
Figure 17:Sequence Diagram for approving a request	50
Figure 18: Analysis Level Class diagram	51
Figure 19:Component diagram	52
Figure 20: Database diagram	53
Figure 21:Deployment Diagram	54

Table 1: Team Roles and Responsibilities.	17
Table 2:use case description for login	28
Table 3:use case description for user registration.	29
Table 4:use case description for request submission	30
Table 5:use case description for approve or reject request	30
Table 6:use case description for assign a technician	31
Table 7:use case description for fill request status.	32
Table 8:use case description for approve spare request.	33
Table 9:use case description for view spare request.	34
Table 10:use case description for send feedback.	35
Table 11:use case description for view report.	35
Table 12:Hardware / Software Mapping	59



CHAPTER ONE: 1. INTRODUCTION
Managing ICT (Information and Communication Technology) support is crucial in modern organizations to ensure smooth operations and timely problem-solving. It involves maintaining systems, troubleshooting issues, and assisting users to keep technology running efficiently. Effective ICT support improves communication, boosts productivity, and helps organizations achieve their goals by minimizing delays and technical disruptions.
But many traditional methods, like using paper forms and manual processes, take too much time, cause mistakes, and are hard to track. This old way delays solutions and makes it hard for managers to understand what problems happen often and how to allocate resources better.
This motivates us to develop an ICT Support and Management Platform that addresses these challenges and simplifies the process. The motivation for this proposal stems from the need to reduce delays, minimize errors, and provide managers with better insights for decision-making. By moving away from manual processes, the system aims to improve the efficiency and transparency of service requests.
1.1 Project Overview
Managing Information and Communication Technology (ICT) support services is a critical function in modern organizations, particularly in large institutions such as universities where daily operations heavily depend on reliable technological systems. ICT support involves maintaining hardware and software systems, troubleshooting technical issues, managing networks, and assisting users to ensure uninterrupted academic and administrative activities.

Despite the importance of ICT services, many organizations still rely on traditional, paper-based, or semi-digital methods for handling ICT support requests. These methods are often inefficient, time-consuming, and difficult to monitor. This project proposes the development of an ICT Support and Management Platform designed specifically for Woldia University ICT Directorate (ICTD). The platform provides a centralized, web-based solution that enables users to submit support requests electronically, allows technicians to manage and resolve issues systematically, and offers managers real-time visibility into ICT operations.

By automating request handling, tracking progress, and generating analytical reports, the system aims to improve service delivery, reduce response times, enhance accountability, and support informed decision-makingwithin the university.

1.2 Problem Statement
Woldia University ICT Directorate currently faces challenges related to the use of paper-based and manual ICT support systems. These traditional methods involve multiple approval steps, lack proper tracking mechanisms, and provide limited accountability. As a result, ICT support requests often experience delays, misplaced records, and unclear responsibility assignments.

Additionally, the absence of centralized digital data prevents management from analyzing recurring issues, evaluating technician performance, and allocating resources efficiently. Urgent requests are frequently mixed with routine issues, leading to increased system downtime and reduced productivity for staff and students. The costs associated with paper usage, printing, storage, and manual labor further compound the problem. These challenges highlight the need for a modern, automated ICT Support and Management Platform to replace outdated processes.
1.3 Project Objectives

The objectives of this project define the intended outcomes of developing and implementing the ICT Support and Management Platform.
1.3.1 General Objective

To design and develop a flexible, efficient, and user-friendly ICT Support and Management Platform for Woldia University ICT Directorate.
1.3.2 Specific Objectives

• To automate the process of logging and tracking ICT support requests.

• To provide users with an easy-to-use platform for reporting issues and monitoring request status.

• To enable ICT staff to prioritize, assign, and manage tasks effectively.

• To improve communication between ICT support teams and end users.

• To generate detailed reports for performance analysis and decision-making.

• To reduce the time and effort required to resolve ICT-related problems.

• To create a centralized database of technical issues for future reference.

1.4 Scope and Limitations
The scope of this project includes the design and development of a web-based ICT Support and Management Platform tailored to the operational structure of Woldia University ICT Directorate. The system supports request submission, tracking, technician assignment, prioritization, notifications, and reporting. It is designed to be scalable and adaptable for future enhancements.

However, the system has limitations. It requires continuous internet connectivity and does not support offline usage. The initial version will be available in a single language and will not include AI-driven automation or integration with external university systems such as inventory management or student information systems.
1.5 Project Significance

The project holds significant technological and organizational value. Technologically, it demonstrates the practical application of modern web technologies to solve real-world institutional challenges. Organizationally, it enhances operational efficiency, reduces downtime, improves transparency, and supports data-driven decision-making.

The system benefits management through improved oversight, technicians through structured workflows, and users through timely and reliable ICT support. Overall, it contributes to improved productivity and service quality within Woldia University.
1.6 Project Beneficiaries

The beneficiaries of this project include staff and students who require ICT support services, ICT technicians responsible for issue resolution, managers and administrators overseeing ICT operations, and Woldia University ICT Directorate as an institution benefiting from improved efficiency and reduced operational costs.
1.7 Feasibility Study

The feasibility of the project has been evaluated across technical, operational, economic, and social dimensions. The use of open-source and widely adopted technologies ensures technical feasibility. Operational feasibility is supported by alignment with existing ICT workflows and user readiness. Economically, the system reduces long-term costs associated with manual processes. Socially, with proper training and user-friendly design, the platform is expected to gain wide acceptance.


1.7.1 Operational Feasibility
•	Workflow Alignment: The platform mirrors existing support processes but adds automation to reduce delays.
•	User Readiness: The interface is user-friendly. Training and manuals will ease the transition for staff.
•	Scalability: The system is designed to grow with the organization’s needs, supporting more users and data as required.
1.7.2 Economic Feasibility
The platform reduces costs by eliminating paper-based processes and lowering administrative overhead. The savings on resources and time make the investment worthwhile for organizations in the long run.
1.7.3 Social Feasibility
The Platform will make it easier for people to ask for help with ICT problems. Some people may not want to use the system at first because they are used to paper forms or phone calls. But, if we give them training and make the system simple, they will start using it. The system will save their time and make their work faster.
1.8 Methodology
1.8.1 Data Collection Methodology
For the development of the ICT Support and Management Platform, a structured and effective data collection methodology was employed to ensure the system meets the needs of all stakeholders. The following methods were used to gather the necessary data:
•	Interviews
Interviews were conducted with key stakeholders, including the IT Manager, Software Development Team Leader, and Technical Support Team Leader. These interviews focused on understanding the challenges, needs, and expectations of each role regarding the ICT support system. The insights gathered helped identify the functional and non-functional requirements of the platform, as well as the areas where improvements were needed to optimize support processes and enhance performance.
•	Observations
To gain a better understanding of the real-world issues and challenges, observations were made within various organizations currently using ICT support systems. These observations focused on identifying inefficiencies and bottlenecks in existing processes, as well as gathering data on how support teams interact with users and handle service requests. The findings from these observations provided valuable input into the design and development of a more efficient system.

Document Analysis
Existing documentation, such as service request forms, reports, and feedback from users, was analyzed to understand the gaps and limitations in the current ICT support systems. This analysis helped highlight recurring problems and areas where the new platform could offer improvements, particularly in streamlining processes and reducing the reliance on paper-based methods.





1.9 System Analysis and Design
System analysis and design is a structured approach to understanding and developing information systems that effectively meet user requirements. It involves two key phases: analyzing the existing system and its challenges, and designing a solution that addresses those challenges while meeting user expectations. For the ICT Support and Management Platform, we employed a role-based analysis approach for the system analysis phase, and we plan to use the Agile methodology for the system design phase, which will be initiated in the future.
1.9.1 System Analysis Using Role-Based Interviews
The system analysis phase focused on gathering detailed insights into the needs, challenges, and expectations of each role involved in the ICT support process. This phase was conducted through direct interviews with key stakeholders, including IT managers, software development team leaders, and technical support team leaders. By gathering information from each role, we aimed to create a comprehensive understanding of how the current system operates and what improvements are needed.
Key steps in our system analysis process included:
Role-Specific Interviews:
Through interviews, IT managers emphasized challenges in resource allocation and the need for improved tracking mechanisms, software development team leaders pointed out technical limitations and potential system enhancements, and technical support team leaders highlighted inefficiencies in request handling and communication gaps.
Observation of Existing Systems:
We analyzed the paper-based system used by various organizations and the Google Form system implemented in Wendo Genet campus. This helped us identify inefficiencies such as delays in processing requests, lack of proper tracking, and the inability to gather customer satisfaction data.
Requirement Documentation:
The gathered data was compiled into a set of functional and non-functional requirements, ensuring that the system addresses the identified challenges while meeting user expectations.
This structured and role-based approach ensured that the analysis phase was thorough and focused, providing a solid foundation for the upcoming design phase.


1.9.2 System Design and Implementation Approach
For the implementation of the ICT Support and Management Platform, modern full-stack web technologies will be utilized. The front-end will be developed using Next.js and React to create a responsive, interactive, and user-friendly interface, with Tailwind CSS used for efficient and consistent styling. The back-end functionality will be implemented using Next.js API Routes with Node.js, enabling seamless server-side processing and integration. . Development will be carried out using Visual Studio Code, while local testing and development will be supported through a Node.js runtime environment. These technologies ensure that the platform is scalable, secure, efficient, and adaptable to future enhancements, in line with the project proposal.
1.9.3 Testing Methodology
For the ICT Support and Management Platform, both functional and non-functional testing will be applied to ensure the system's reliability, security, and user satisfaction. These testing methods will be adapted specifically to the needs of our project to guarantee that all features work as intended and that the platform is secure and user-friendly.
Functional Testing:
•	Unit Testing: Each module of the platform, such as user login, request submission, and feedback collection, will undergo unit testing. We will test individual functions to ensure they work independently without affecting other system components. For instance, we will verify that the user authentication process correctly identifies valid users and denies unauthorized access.
•	Integration Testing: After unit testing, integration testing will confirm that modules like request management, user roles, and approval workflows work together seamlessly. We will test how data flows from the user’s request submission to its approval or rejection, ensuring that all parts of the system are communicating correctly.
•	System Testing: System testing will evaluate the platform as a whole, simulating real-world scenarios such as multiple users submitting service requests, approving them, and providing feedback. This phase will ensure that the system meets its functional requirements, such as handling multiple concurrent users and accurately processing requests.
•	User Acceptance Testing (UAT): End-users, including staff from various departments, will test the system to ensure it meets their needs and is easy to use. This will involve tasks like submitting requests, tracking progress, and providing feedback on the system’s performance. Feedback from this testing will be used to fine-tune the user interface and features before deployment.
Non-Functional Testing:
•	Usability Testing: To ensure the platform is user-friendly, we will gather feedback from users on the ease of submitting and tracking requests. Observations during this testing will help identify any confusing workflows or complex navigation, which will be addressed to improve the overall user experience.
•	Security Testing: We will perform rigorous security testing to protect sensitive user data. This include verifying secure password storage, and ensuring proper authentication mechanisms are in place. We will also test user permissions to ensure that roles like technicians and managers only have access to relevant data.
By applying these testing methods, we aim to ensure that the ICT Support and Management Platform is fully functional, secure, and user-friendly before it is deployed for use by the university.
1.9.4 Deployment Methodology
Deploying the ICT Support and Management Platform will follow simple and clear steps to ensure it works properly and is accessible to all users.
•	Preparing the Environment:
First, we will set up the required server and database on a secure and reliable system. This includes installing software like a web server (e.g., Apache) and ensuring the database system is ready.
•	Uploading the System:
The system files will be transferred to the server using tools like File Transfer Protocol (FTP). After uploading, the files will be placed in the correct directory so the system can run smoothly.
•	Configuring the System:
We will adjust the system’s settings, such as database connections, user roles, and email notifications, to match the organization's needs.
•	Testing After Deployment:

After the system is live, basic testing will be done to ensure all features, like submitting requests and tracking their status, work correctly on the server.
•	User Training and Support:
We will train key users, such as managers and technicians, on how to use the platform effectively. A support system will also be in place to address any issues during the early days of use.
•	Monitoring and Feedback:
Continuous monitoring will be done to check the system’s performance, and feedback from users will help identify and fix any problems quickly.

1.9.5 Security Methodology
To ensure the security of the ICT Support and Management Platform, we focus on the most essential measures to protect data and maintain system integrity:
Authentication and Authorization:
Secure login mechanisms with unique credentials will be used for all users. Role-based access control (RBAC) will ensure users access only the features and data relevant to their roles, such as managers, technicians, and administrators.

1.	 Data Encryption:
Sensitive information, such as user credentials and request details, will be encrypted using bcrypt or argon2 for password hashing, ensuring secure storage. For other data, AES-256 encryption will be used to protect sensitive information at rest. Communication between the server and users will be secured with SSL/TLS protocols via HTTPS, ensuring that data transmitted over the network remains confidential and protected from interception.

1.10 System Development

For the design phase of our project, we will adopt the Agile methodology. This approach emphasizes an iterative development process, collaboration among team members, and adaptability as the project evolves. Agile is well-suited for system design because it encourages continuous improvement of features, ensuring user feedback is incorporated throughout the entire process.
The key aspects of the Agile approach that we plan to implement are:
•	Iterative Prototyping: We will begin by creating initial visual representations of the system's components, such as the user interfaces and workflows. This allows us to gather early feedback, helping to refine and improve the design gradually.
•	User Stories: To ensure we meet the needs of different users, we will create simple descriptions of how each user type will interact with the system.
•	Modular Development: The system will be divided into smaller, manageable parts. Each component will be developed and tested independently, making the development process more flexible and efficient.
•	Continuous Feedback: We will involve stakeholders regularly to review the prototypes and provide their input. This ensures that the system’s final design aligns with their needs and expectations.
By combining the insights gathered during the system analysis phase with the Agile methodology in the design phase, we aim to create a strong foundation for the ICT Support and Management Platform. This user-centered approach will allow us to remain adaptable, ensuring the system delivers value throughout its development.
1.11 Development Tools

The development tools include Next.js and React for frontend development, Node.js with Express.js for backend services, PostgreSQL with Prisma ORM for database management, and Tailwind CSS for user interface design. Documentation and modeling tools such as Microsoft Word and Draw.io are used throughout the project lifecycle.


1.12 Team Roles and Responsibilities
No.	Name	ID	Major Responsibilities
1	DAGM WOLDEKIDAN	1304693	Project Manager • Backend Development (node.js API Routes) • PostgreSQL Database Design & Management • Deployment Coordination
2	GELETA BEKELE	1301323	Frontend Lead (Next.js/React/TypeScript) • UI/UX Design & Implementation • Tailwind CSS Styling • Component Library Development
3	KALEAB BAYEH	1301691	Requirements Analysis Lead • UML/System Modeling • Stakeholder Communication • Report Generation & Progress Tracking
4	KALEB TESHOME	1301696	Technical Documentation • Data Collection & User Research • Frontend Support & Testing • User Manual Preparation
5	KALEB MELAKU	1301697	Backend Development (API Integration) • Prisma ORM & PostgreSQL Integration • System Testing & Security Implementation • Performance Optimization
Table 1: Team Roles and Responsibilities.








Chapter Two: Analysis of the current system
2.1 Description of the Current System
The ICT Support Management System at Woldia University is currently handled using manual paper-based procedures and phone calls. There is no centralized digital platform for managing ICT-related problems or service requests. Users who experience ICT issues must either visit the ICT Directorate office to fill out a paper form or contact ICT staff directly through phone calls.
In the manual system, users describe their ICT problems on a printed request form. This form is submitted to a department head or responsible authority for approval before being forwarded to the ICT Directorate. After approval, the request is assigned to an ICT technician, who addresses the issue and records feedback on the same paper form.
In the phone call–based system, users contact ICT technicians or office staff directly to report urgent issues. While this method allows quick communication, it lacks formal documentation and often requires later completion of paper forms to maintain records.
Although these methods allow ICT services to operate, they are inefficient, difficult to track, and prone to delays, especially as the university continues to grow in size and complexity.
2.2 Overview of the Current System
The current ICT support process at Woldia University follows a traditional and fragmented workflow. It is heavily dependent on human intervention and physical documentation, which limits transparency, accountability, and service quality.
The overall workflow of the existing system can be summarized as follows:
1.	A user identifies an ICT-related problem.
2.	The user reports the issue either:
•	By filling out a paper-based request form, or
•	By calling ICT staff directly
3.	For paper-based requests:
•	The form is submitted to a supervisor or department head for approval.
•	After approval, the form is sent to the ICT Directorate.
4.	The ICT Directorate assigns the request to an available technician.
5.	The technician resolves the issue and records the outcome manually.
6.	The completed form is archived for record-keeping purposes.
This system does not provide real-time updates to users, does not support automated tracking, and does not offer a structured way to collect user feedback or generate performance reports.
2.3 Structure of the Existing System
The structure of the existing ICT support system at Woldia University consists of three main components: users, administrative approval, and ICT technical staff. These components interact through manual documents and verbal communication, as shown below.
2.3.1 Users
Users include academic staff, administrative staff. Users initiate service requests by:
•	Filling out a paper-based ICT request form, or
•	Contacting ICT staff via phone calls.
2.3.2 Approval and Administration
Once a paper-based request is submitted, it must be approved by a department head or authorized personnel. This approval process is entirely manual and often causes delays, especially when approvers are unavailable.
2.3.3 ICT Directorate and Technicians
The ICT Directorate receives approved requests and assigns them to technicians based on availability and expertise. Technicians resolve the reported issues and provide feedback on the same physical document. Completed forms are stored manually for future reference.
Limitations of the Structure
•	No centralized database for requests
•	No automated tracking of request status
•	No notification system for users
•	Difficulty in retrieving historical data
•	Lack of performance monitoring and reporting



















Chapter Three: Software Requirements Specification
3.1 Proposed System Overview
The proposed ICT Support and Management Platform is a web-based system designed to automate and improve the process of managing ICT service requests at Woldia University. The system replaces the existing manual and phone-based processes with a centralized digital platform that enables efficient request submission, approval, tracking, resolution, and reporting.
The platform supports multiple user roles, including Requester (User), Approver, Manager, Technician, Store Keeper, and System Administrator. Each role is provided with specific privileges and functionalities to ensure secure access, accountability, and efficient workflow management.
The system aims to improve service delivery by reducing delays, increasing transparency, enhancing communication, and providing reliable data for decision-making.
3.2 Functional Requirements (FR)
The functional requirements define what the system must do to meet user and organizational needs.
•	notification (the system shall send automated notification (email) for key event such as request submission, approval, task assignment
•	searching
FR-1:  Login and Register
•	The system shall allow users to log in using a valid username and password.
•	The system shall authenticate users before granting access.
•	The system shall restrict access based on predefined user roles and permissions.
FR-2: Submit ICT Support Request
•	The system shall allow users to submit ICT support requests electronically.
•	The system shall require users to provide necessary details such as issue type, description, and urgency.
•	The system shall validate request data before submission.
•	The system shall assign a unique request ID to each request.
FR-3: Request Tracking and status monitoring
•	The system shall allow users to view the status of their submitted requests.
•	The system shall display status updates such as Submitted, Approved, Assigned, Fixed, Escalated, or Rejected.
•	The system shall allow managers and technicians to view all relevant requests.
FR-4: Request review and Approve 
•	The system shall allow approvers to review submitted requests.
•	The system shall enable approvers to approve or reject requests.
•	The system shall require a reason for request rejection.
•	The system shall update the request status based on the decision.
FR-5: Task assignment management 
•	The system shall allow managers to assign approved requests to technicians.
•	The system shall display available technicians for selection.
•	The system shall notify technicians when tasks are assigned.
FR-6: Resolve ICT Issues
•	The system shall allow technicians to view assigned requests.
•	The system shall allow technicians to update request status after diagnosis.
•	The system shall allow technicians to mark requests as Fixed, Escalated, or Need Spare.
•	The system shall record resolution details and completion time.
FR-7: Escalate Issues
•	The system shall allow users or technicians to escalate unresolved issues.
•	The system shall forward escalated issues to higher-level authorities.
•	The system shall update the request status to Escalated.
FR-8: Spare parts request processing

•	The system shall allow technicians to request spare parts.
•	The system shall allow managers to approve spare part requests.
•	The system shall forward approved spare requests to the store keeper.
FR-9: Role
•	The system shall allow store keepers to view spare requests.
•	The system shall allow allocation of available spare parts.
•	The system shall allow store keepers to request purchases if spares are unavailable.
FR-10: User Feedback Management
•	The system shall allow users to provide feedback after issue resolution.
•	The system shall allow users to rate service satisfaction and provide comments.
•	The system shall store feedback for evaluation.
FR-11: Reporting and Analytics
•	The system shall allow managers to generate reports.
•	The system shall generate reports on request volume, response time, and technician performance.
•	The system shall support filtering and analysis of historical data.
FR-12: User and System Management
•	The system shall allow managers and system administrators to manage user accounts.
•	The system shall allow system administrators to configure system settings.
•	The system shall provide map (GPS-based) location information for the ICT Directorate.
•	The system shall maintain system logs and audit trails.
FR-13: Notification Management
•	The system shall send automated email notifications for key events.
•	The system shall notify users upon ICT support request submission.
•	The system shall notify approvers when a request requires approval.
•	The system shall notify users when requests are approved or rejected.
•	The system shall notify technicians when tasks are assigned.
FR-14: Searching and Filtering
•	The system shall allow users to search ICT support requests.
•	The system shall support searching by request ID, issue type, status, date, and priority.
•	The system shall allow managers and technicians to filter requests based on role-specific criteria.
•	The system shall support searching users, technicians, and assets.
FR-15: Asset and Equipment Management
•	The system shall allow registration of ICT assets such as computers, printers, servers, and network devices.
•	The system shall store asset details including asset ID, type, model, serial number, location, and status.
•	The system shall allow managers and technicians to view asset maintenance history.
•	The system shall support updating asset status (Active, Under Maintenance, Faulty, Retired).
•	The system shall generate reports related to asset usage and failures.

3.3 Non-Functional Requirements (NFR)
The non-functional requirements define how well the system must perform.
NFR-1: Performance
•	The system shall process user requests with minimal response time.
•	The system shall support concurrent users without performance degradation.
•	The system shall be optimized for efficient database operations.
NFR-2: Usability
•	The system shall provide a simple and intuitive user interface.
•	The system shall support users with minimal technical knowledge.
•	The system shall provide help messages and guidance where necessary.
NFR-3: Security
•	The system shall encrypt sensitive data during transmission using TLS.
•	The system shall securely store passwords using hashing algorithms such as bcrypt or Argon2.
•	The system shall prevent unauthorized access through role-based access control.
NFR-4: Reliability
•	The system shall be available during working hours with minimal downtime.
•	The system shall handle system errors gracefully.
•	The system shall maintain data consistency and integrity.
NFR-5: Maintainability
•	The system shall be designed using clean and modular architecture.
•	The system shall support easy updates and bug fixes.
•	The system shall include proper documentation for maintenance.
NFR-6: Compatibility
•	The system shall be accessible from different devices, including desktops and mobile devices.
•	The system shall function correctly on major web browsers.
•	The system shall support responsive design.
3.4 Use Case Models
Use case models are used to visually and conceptually represent the functional behavior of the ICT Support and Management Platform. They illustrate how different users (actors) interact with the system to achieve specific goals. These models help in understanding system requirements, defining system boundaries, and identifying interactions between users and system components.
The use case models provide a clear overview of system functionalities and ensure that all user requirements are properly captured and addressed during system design and implementation.
3.4.1 Use Case Diagram
The use case diagram represents the interactions between system actors and the ICT Support and Management Platform. It identifies the various actors involved in the system and the services (use cases) they can perform.
Actors of the System
The ICT Support and Management Platform includes the following actors, categorized into user roles and system roles:
User Roles
•	Requester (User): Initiates ICT support requests and provides feedback after service completion.
•	Approver: Reviews and approves or rejects submitted ICT support requests.
•	Technician: Diagnoses and resolves approved ICT issues and updates request status.
•	Manager: Assigns technicians, approves spare requests, monitors progress, and generates reports.
•	Store Keeper: Manages ICT spare parts and allocates approved spare requests.
System Role
•	System Administrator: Manages system configuration, user accounts, roles, permissions, and system security.











3.4.1.1 use case diagram







	






	



 
Figure 1:usecase diagram for the system




3.4.1.2 Use Case Description 
User Case ID:	UC01
User Case Name:	Login.
Actors:	Users, Technicians, Admin, Manager, Approver, Store Keeper.
Description:	Validates the user to enter the system.
Trigger:	An actor wants to login to the system
Preconditions:	The user must have at least privilege, username and password.
Normal Flow:	Actor action	System response
Step1: User has to activate the system.
Step3: User fills his or her username and password. 
Step4: he/she click the login button.
Step6: the User get authentication and access the system.
	Step2: The System responses by displaying the login interface and allow the user for the user name and password. 
Step5: System verifies user_name and Password.
Step7: System displays its main window.
Step8: Use case ends.  

Post conditions:	The user get access to the system according to their predefined system privilege and finally he/she logout or turn off the page.

Alternative:	If User enters wrong user ID and/or password
6. System displays an incorrect message alert.
7. System enables user to try again.
Table 2:use case description for login

User Case ID:	UC02
User Case Name:	User Registration.
Actors:	Manager.
Description:	To register new user with account.
Trigger:	The manager wants to register new user.
Preconditions:	The manager must have username and password.
Normal Flow:	Actor action	System response
Step1: Manager has to login to the system.
Step3: Manager click the registration button
Step5: Manager fulfil the form.
Step6: Manager click register  button 	Step2: The System display the available page
Step4: System display the registration form.
Step7: System validate the inputs
Step8: System show registred message alert
Step9 Use case ends

Post conditions:	The user gets access to the system according to his/her role.
Alternative:	If Manager fills the form incorrectly.
8. System displays an incorrect message alert and enables manager to try again. 
Table 3:use case description for user registration.

User Case ID:	UC03
User Case Name:	Request submission.
Actors:	User.
Description:	To send support request.
Trigger:	The user wants to send support request.
Preconditions:	The user asks a request.
Normal Flow:	Actor action	System response
Step1: user has to login to the system.
Step3: user click the request button
Step5: user fulfil the form.
Step6: user click send request button
	Step2: The System display the available page
Step4: System display the request form.
Step7: System validate the inputs
Step8: System show received message alert
Step9:System send the request to approver
Step10:Use case ends

Post conditions:	The user sends a request successfully.
Alternative:	If User fulfills the form incorrectly..
8. System displays an incorrect message alert and enables user to fill the form again. 
Table 4:use case description for request submission
   
User Case ID:	UC04
User Case Name:	Approve or Reject a request.
Actors:	Approver.
Description:	To Approve or Reject user request.
Trigger:	The approver wants to approve or reject a request.
Preconditions:	The approver receive request.
Normal Flow:	Actor action	System response
Step1: approver has to login to the system.
Step3: approver click view request button
Step5: approver click approve request button
	Step2: The System display the available page
Step4: System display the request .
Step6: System show approved message alert
Step7:System send the request to manager
Step8:Use case ends

Post conditions:	The approver approves or rejects a request.
Alternative:	If Approver receives invalid request
5. Approver click reject request button. 
6. System show rejected message alert.
7. System changes request status to reject.
Table 5:use case description for approve or reject request

User Case ID:	UC05
User Case Name:	Assign a technician.
Actors:	Manager.
Description:	To Assign a technician according to issue.
Trigger:	The manager wants to assign a technician for a request.
Preconditions:	The manager receive request.
Normal Flow:	Actor action	System response
Step1: manager has to login to the system.
Step3: manager click view request button.
Step5: manager click assign technician button.
Step7:manager choose a technician.

	Step2: The System display the available page
Step4: System display the request .
Step6: System show available technician name.
Step8:System send the request to technician.
Step8:Use case ends

Post conditions:	The manager assigns a technician.
Alternative:	
Table 6:use case description for assign a technician



User Case ID:	UC06
User Case Name:	Fill request status.
Actors:	Technician.
Description:	To Fill request status.
Trigger:	The technician wants to fill request status.
Preconditions:	The technician checks the issue.
Normal Flow:	Actor action	System response
Step1: technician has to login to the system.
Step3: technician click view request button
Step5: technician click fixed button
	Step2: The System display the available page
Step4: System display the request .
Step6: System show fixed message alert
Step7: System changes request status to fixed
Step8:Use case ends

Post conditions:	The technician reports a status.
Alternative:	If the request is beyond the capability technician.
5. Technician click escalate button.
6. System show escalate message alert.
7, System changes request status to escalated.
If the request needs a spare part
5. Technician click need spare button.
6. System display need spare form.
7. Technician fills the form.
8. System show submitted message alert.
9. System changes request status to need spare.

Table 7:use case description for fill request status.


User Case ID:	UC07
User Case Name:	Approve spare request.
Actors:	Manager.
Description:	To approve and send spare request.
Trigger:	The manager wants to approve a spare request.
Preconditions:	Manager receives spare request.
Normal Flow:	Actor action	System response
Step1: manager has to login to the system.
Step3: manager click view request button
Step5: manager click  spare request button
Step7: manager click approve spare button


	Step2: The System display the available page
Step4: System display the request  page.
Step6: System display spare requested
Step8: System show approved message alert
Step9:System send the request to store keeper
Step10:Use case ends
1.	
Post conditions:	The manager send spare request to store keeper.
Alternative:	


Table 8:use case description for approve spare request.






User Case ID:	UC08
User Case Name:	View spare request.
Actors:	Store keeper.
Description:	To view request and allocate spare.
Trigger:	The store keeper wants to view a spare request.
Preconditions:	The store keeper receives spare request.
Normal Flow:	Actor action	System response
Step1: store keeper has to login to the system.
Step3: store keeper click  allocate button
	Step2: The System display the available page
Step4: System show allocated message alert.
Step5:System changes the request status to spare allocated.
Step6:Use case ends
1.	
Post conditions:	The store keeper allocate spare or ask purchase.
Alternative:	If  the requested spare is not available.
3. Store keeper click purchase requested button.
4. System changes request status to purchase.
5. Use case ends.
Table 9:use case description for view spare request.


User Case ID:	UC09
User Case Name:	Send feedback.
Actors:	User.
Description:	To rate satisfaction and comment the service.
Trigger:	The user wants to send feedback.
Preconditions:	Request status change.
Normal Flow:	Actor action	System response
Step1: user has to login to the system.
Step3: user click view request button.
Step4: user click feedback button.
Step6: user choose satisfaction level.

	Step2: The System display the available page
Step4: System display request page.
Step5: System display feedback page.
Step7: System shows feedback accepted message alert.
Step8:Use case ends
1.	
Post conditions:	Rate satisfaction and comment the service.
Alternative:	


Table 10:use case description for send feedback.


User Case ID:	UC10
User Case Name:	View report.
Actors:	Manager.
Description:	To view report of report of analyzed data.
Trigger:	The manager wants to view report analysis
Preconditions:	The system store data.
Normal Flow:	Actor action	System response
Step1: manager has to login to the system.
Step3: manager click  view report button
Step5: manager choose his preference.	Step2: The System display the available page
Step4: System show report page.
Step6:system display the report.
Step5:Use case ends

Post conditions:	The system analyzes data and display report.
Alternative:	


Table 11:use case description for view report.


















3.4.2 Activity diagram
The basic purposes of activity diagrams are to captures the dynamic behavior of the system. We try to show message flow from one activity to another in the proposed system. Activity is a particular operation of the system.

 
Figure 2:Activity diagram for login



 
Figure 3:Activity diagram for user registration






 
Figure 4: Activity diagram for request submission


 
Figure 5:Activity diagram for approve or reject a request.



 
Figure 6:Activity diagram for assign technician




 
Figure 7:Activity diagram for fill request status

 
Figure 8:Activity diagram for approve a spare request.



 
Figure 9:Activity diagram for view spare request


 
Figure 10:Activity diagram for send feedback.

.

 
Figure 11:Activity diagram for view report.










3.4.3 Sequence Diagram
A Sequence diagram is an interaction diagram that shows how processes operate with one another and in what order. In the proposed system we try to show this process in there order for the basic use cases.


 
Figure 12: Sequence Diagram for login


 
Figure 13:Sequence Diagram for user registration.
 




 
Figure 14: Sequence Diagram for request submission.

	

 
Figure 15:Sequence Diagram for fill request status.
 
Figure 16: Sequence Diagram for assigning a technician.

 
Figure 17:Sequence Diagram for approving a request







3.4.4 Class diagram
 
Figure 18: Analysis Level Class diagram






 
Figure 19:Component diagram





 
Figure 20: Database diagram








 
Figure 21:Deployment Diagram
Chapter Four: System Design
4.1 Introduction
The ICT Support and Management Platform is designed to streamline the management of ICT service requests within an organization by providing a centralized and automated solution. The system enables users to submit, track, and manage ICT support requests in a transparent and efficient manner. It also supports real-time status updates, role-based task management, and detailed reporting to enhance decision-making and operational efficiency.
The proposed system is implemented using a modern web-based architecture, with Next.js used for the frontend to deliver a responsive and user-friendly interface, Node.js for the backend to handle business logic and RESTful API services, and PostgreSQL as the relational database for secure and reliable data storage. This architecture ensures high performance, scalability, and ease of maintenance.
To ensure system security and data integrity, the platform incorporates JWT-based authentication, role-based access control (RBAC), password hashing, and HTTPS communication. These security mechanisms protect sensitive user data and restrict system access based on user roles.
Overall, the system design aims to improve service delivery, enhance productivity, and provide a flexible and secure ICT support solution that can adapt to the evolving needs of organizations.
4.2 Purpose of the System Design Document (SDD)
The purpose of the System Design Document (SDD) is to define how the ICT Support and Management Platform will be designed and to provide technical solutions for the challenges identified during the system analysis phase. The SDD serves as a foundation for the development process by clearly describing the system architecture, design decisions, and technical specifications.
Specifically, the purpose of the SDD is to:
•	Facilitate Communication and Collaboration
	Enable effective communication and coordination among all stakeholders involved in the ICT Support and Management Platform project.
•	Support Verification and Validation
	Provide detailed design specifications and requirements for system testing and quality assurance.
	Ensure that the implemented system satisfies both functional and non-functional requirements and aligns with project objectives.
•	Document Design Decisions and Specifications
	Capture system design decisions, technical specifications, and architectural choices.
	Serve as a reference document for future system maintenance, enhancements, and upgrades while preserving system integrity.
•	Provide a Clear Development Roadmap
	Offer a structured roadmap for system implementation, including resource allocation and timeline planning.
	Identify potential risks and support efficient planning, coordination, and execution of the project.
4.3 Design Goals
The design goals for the ICT Support and Management Platform are as follows:
•	User-Centric Design: Ensure the platform is intuitive and easy to use for all stakeholders, including users, technicians, approvers, and managers, regardless of their technical expertise.
•	Efficiency and Automation: Streamline workflows by automating repetitive tasks such as request submission, tracking, and assignment to reduce response times and improve productivity.
•	Scalability: Design the system to handle increasing numbers of users, requests, and data volumes as the organization grows, without compromising performance.
•	Reliability and Availability: Ensure the platform operates consistently with minimal downtime, providing uninterrupted access to users and stakeholders.
•	Data Integrity and Security: Implement robust security measures to protect sensitive data and ensure that all stored and transmitted information is accurate and secure.
•	Real-Time Tracking and Notifications: Provide real-time updates on request statuses and notifications to ensure transparency and keep all stakeholders informed.
•	Customizability: Enable flexibility in adapting the platform to the specific needs and policies of different organizations while maintaining core functionalities.
•	Comprehensive Reporting: Offer detailed reports and analytics on system performance, common issues, and resource utilization to support data-driven decision-making.
•	Maintainability: Design the platform to be easily maintainable, allowing for smooth updates, debugging, and enhancements over time.
•	Accessibility Across Devices: Ensure the platform is accessible on both desktop and mobile devices, providing users with flexibility and convenience in using the system.
4.4 Current Software Architecture
The existing ICT support system at Woldia University relies on manual paper-based forms and phone calls, without a centralized digital platform or database. This results in delays, data loss, lack of tracking, and limited reporting capabilities.
4.5 Proposed Software Architecture
4.5.1 Overview	
The proposed system follows a three-tier architecture, separating concerns into:
1.	Presentation Layer (Frontend)
2.	Application Layer (Backend / Business Logic)
3.	Data Layer (Database)
This architecture improves system maintainability, performance, and security.
4.5.2 Subsystem Decomposition
The platform is divided into the following subsystems:
•	Authentication and Authorization Subsystem
Handles login, role-based access control, and permissions.
•	User Management Subsystem
Manages user accounts, roles, and profiles.
•	Request Management Subsystem
Handles request submission, approval, assignment, escalation, and tracking.
•	Approval Workflow Subsystem
Supports request review, approval, or rejection by authorized personnel.
•	Technician Management Subsystem
Manages task assignment, resolution updates, and escalations.
•	Inventory / Store Management Subsystem
Handles spare part requests and approvals.
•	Feedback Management Subsystem
Collects and stores user feedback and satisfaction ratings.
•	Reporting and Analytics Subsystem
Generates reports on performance, workload, and response times.
•	Notification Subsystem
Sends system alerts and updates to users.

4.5.3 Hardware / Software Mapping
Component	Technology
Client Devices	Desktop and Mobile Devices
Frontend	Next.js
Backend	Node.js (Express / REST API)
Database	PostgreSQL
API Communication	RESTful APIs
Authentication	JWT-based authentication
Security	HTTPS, RBAC, Password Hashing
Table 12:Hardware / Software Mapping
4.5.4 Database Design
The system uses PostgreSQL, a relational database, to store and manage:
•	User and role information
•	ICT support requests
•	Approval and assignment records
•	Technician task updates
•	Spare part requests
•	Feedback and ratings
•	System logs and reports
The database design follows normalization principles to ensure data integrity, consistency, and efficient querying.


4.5.5 Access Control and Security
The system enforces strong security mechanisms, including:
•	Role-Based Access Control (RBAC)
•	Secure authentication using JWT
•	Password hashing using bcrypt or Argon2
•	Encrypted data transmission via HTTPS
•	Input validation and error handling
•	System activity logging and audit trails
4.5.6 Boundary Conditions
•	The system requires an internet connection
•	Users must be authenticated to access features
•	Requests must follow predefined workflows
•	System performance depends on server and database availability
4.6 User Interface Design
The user interface is designed to be responsive, intuitive, and role-based, ensuring ease of use for all stakeholders.
4.6.1 Navigational Paths
•	Requester: Login → Dashboard → Submit Request → Track Request Status → View Resolution → Provide Feedback
•	Approver: Login → Dashboard → View Pending Requests → Review Request Details → Approve/Reject → Logout
•	Manager: Login → Dashboard → View Approved Requests → Assign Technician → Monitor Progress → View Reports → (Optional: Manage Users) → Logout
•	Technician: Login → Dashboard → View Assigned Tasks → Update Task Status → [Fixed/Escalate/Need Spare] → Logout
•	Store Keeper: Login → Dashboard → View Spare Part Requests → Allocate Spare Parts → (Optional: Request Purchase) → Logout
•	System Admin: Login → Dashboard → Manage Users → Configure System Settings → View System Logs → Generate Reports → Logout
4.6.2 Screen Mock-ups
The system includes the following main screens:
1. Login Screen
•	Logo / System Name at the top.
•	Fields: Username, Password.
•	Buttons: Login, Forgot Password.
•	Footer: “ICT Support and Management Platform.”
 

2. User Dashboard
•	Top bar: Welcome message + Logout.
•	Main options:
o	Submit Request (button).
o	Track Request Status (list with status icons: Pending, Approved, Assigned, Completed).
o	Provide Feedback (button).
o	Escalate Issue (button).
 
3. Request Submission Form
•	Fields:
o	Request Title.
o	Description of Issue.
o	Select Spare (dropdown).
o	Status (auto set to “Pending”).
•	Buttons: Submit, Cancel.
 
4. Approver Dashboard
•	Pending Requests Table: Request ID, User, Description, Status.
•	Action buttons: Approve / Reject.
•	Escalated Issues: Highlighted list.
 
5. Technician Dashboard
•	Assigned Requests Table: Request ID, Issue, Status.
•	Update Status: Dropdown (Fixed / Needs Spare / Escalated).
•	Request Spare Part: Button → opens spare request form.
 
6. Storekeeper Dashboard
•	Spare Requests Table: Request ID, Technician, Spare Needed.
•	Actions: Approve / Allocate / Request Purchase.
•	Inventory Overview: Simple table of spare parts (Name, Quantity, Status).
 
7. Manager Dashboard
•	Assign Technician: Dropdown + Assign button.
•	Reports Section: Buttons for Monthly, Technician, Issue based reports.
•	Escalations: List for review.
 
8. Admin Dashboard
•	Manage Users Table: User ID, Role, Status.
•	Actions: Add / Update / Delete.
•	Maintain System
 

