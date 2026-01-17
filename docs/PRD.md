# Product Requirements Document (PRD)
## Lifterico Delivery Platform

### Document Information
- **Version:** 1.0
- **Last Updated:** January 2026
- **Status:** Draft

---

## 1. Executive Summary

### 1.1 Product Vision
Lifterico is a comprehensive delivery management platform designed to revolutionize last-mile delivery operations in Nigeria. The platform connects SMEs, logistics businesses, dispatch riders, and customers through a unified, transparent, and efficient system.

### 1.2 Problem Statement
Nigerian SMEs and customers face significant challenges in last-mile delivery:
- Poor addressing systems in urban areas
- Lack of delivery transparency and real-time tracking
- Unreliable communication between stakeholders
- Frequent delivery disputes and delays
- No standardized proof of delivery mechanisms
- Limited accountability for dispatch riders

### 1.3 Solution
Lifterico provides:
- Real-time GPS tracking with ETA predictions
- Integrated communication tools (chat, SMS, WhatsApp)
- Digital proof of delivery (photo, OTP, signature)
- Role-based dashboards for all stakeholders
- Analytics and reporting for business insights
- Secure payment processing with commission model

---

## 2. Target Users

### 2.1 Primary Users

#### Admin
- System administrators managing the entire platform
- Responsibilities: User management, dispute resolution, system monitoring, configuration

#### Logistics Business
- Companies that own and manage delivery fleets
- Can onboard and manage multiple riders
- Receive delivery requests from SMEs
- Earn revenue from delivery services (minus 15% platform commission)

#### SME (Small & Medium Enterprise)
- Business owners needing delivery services
- Create and manage delivery orders
- Can request upgrade to Logistics Business tier
- Pay for delivery services through the platform

#### Rider
- Dispatch riders executing deliveries
- Accept/reject delivery requests
- Update delivery status in real-time
- Capture proof of delivery
- Work under Logistics Business or independently

#### Customer (Future Phase)
- Recipients of deliveries
- Track deliveries in real-time
- Communicate with riders
- Confirm delivery receipt
- Pay on delivery (COD - future feature)

---

## 3. Feature Requirements

### 3.1 Core Features (Phase 1)

#### F1: User Management & Authentication
| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F1.1 | User Registration | High | Multi-role registration with verification |
| F1.2 | Authentication | High | Secure login with email/phone + password |
| F1.3 | Role-based Access | High | Different dashboards per user role |
| F1.4 | Profile Management | High | User profile CRUD operations |
| F1.5 | Password Recovery | High | Secure password reset flow |
| F1.6 | Session Management | Medium | Multi-device session handling |

#### F2: Order Management
| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F2.1 | Order Creation | High | SMEs create delivery orders with details |
| F2.2 | Order Assignment | High | Automatic/manual rider assignment |
| F2.3 | Order Tracking | High | Real-time order status updates |
| F2.4 | Order History | Medium | Historical order records and search |
| F2.5 | Order Cancellation | Medium | Cancel orders with reason tracking |
| F2.6 | Bulk Orders | Low | Create multiple orders at once |

#### F3: Rider Management
| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F3.1 | Rider Onboarding | High | Logistics business adds riders to fleet |
| F3.2 | Rider Verification | High | Document verification for riders |
| F3.3 | Rider Assignment | High | Auto-assign nearest available rider |
| F3.4 | Rider Status | High | Online/offline/busy status tracking |
| F3.5 | Rider Performance | Medium | Performance metrics and ratings |
| F3.6 | Fleet Management | Medium | Manage multiple riders as a fleet |

#### F4: Real-time Tracking
| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F4.1 | GPS Tracking | High | Real-time rider location tracking |
| F4.2 | ETA Calculation | High | Dynamic ETA based on traffic/distance |
| F4.3 | Route Display | High | Show delivery route on map |
| F4.4 | Location History | Medium | Track delivery route history |
| F4.5 | Geofencing | Low | Alerts when rider enters/exits zones |

#### F5: Analytics & Reporting
| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F5.1 | Dashboard Stats | High | Key metrics overview |
| F5.2 | Delivery Reports | Medium | Detailed delivery analytics |
| F5.3 | Revenue Reports | Medium | Earnings and commission tracking |
| F5.4 | Performance Reports | Medium | Rider and business performance |
| F5.5 | Export Reports | Low | Export data to CSV/PDF |

### 3.2 Secondary Features (Phase 2)

#### F6: Communication
| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F6.1 | In-app Chat | Medium | Real-time messaging between users |
| F6.2 | SMS Notifications | Medium | SMS alerts via Africa's Talking |
| F6.3 | Push Notifications | Medium | Real-time push notifications |
| F6.4 | WhatsApp Integration | Low | WhatsApp message triggers |

#### F7: Proof of Delivery
| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F7.1 | Photo Capture | High | Photo proof of delivery |
| F7.2 | OTP Verification | High | Customer confirms with OTP |
| F7.3 | Digital Signature | Medium | Signature capture on delivery |
| F7.4 | Delivery Notes | Medium | Add notes to delivery |

### 3.3 Future Features (Phase 3+)

#### F8: Payment Integration
| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F8.1 | Paystack Integration | High | Secure payment processing |
| F8.2 | Wallet System | Medium | In-app wallet for transactions |
| F8.3 | Commission Deduction | High | Automatic 15% commission |
| F8.4 | Payout Management | Medium | Rider/business payouts |
| F8.5 | COD Support | Low | Cash on delivery handling |

#### F9: Customer Portal (Mobile)
| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F9.1 | Delivery Tracking | High | Track deliveries in real-time |
| F9.2 | Delivery Confirmation | High | Confirm receipt of delivery |
| F9.3 | Rating & Reviews | Medium | Rate riders and service |
| F9.4 | Payment (COD) | Low | Pay on delivery |

---

## 4. Business Rules

### 4.1 Commission Model
- Platform charges 15% commission on each delivery service
- Commission deducted from Logistics Business earnings
- SMEs pay full delivery fee to platform
- Platform settles with Logistics Business (minus commission)

### 4.2 User Upgrade Path
- SMEs can request upgrade to Logistics Business tier
- Upgrade requires:
  - Minimum delivery history
  - Business verification documents
  - Admin approval
- Upgraded SMEs can then onboard and manage riders

### 4.3 Rider Assignment Logic
1. **Automatic Assignment (Default)**
   - System finds nearest available rider
   - Considers rider's current load
   - Factors in rider rating
   
2. **Manual Assignment**
   - Logistics Business can manually assign specific rider
   - SME can request specific Logistics Business

### 4.4 Order Status Flow
```
PENDING → ACCEPTED → PICKED_UP → IN_TRANSIT → DELIVERED
                ↓                      ↓
            REJECTED              FAILED/RETURNED
```

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Page load time: < 3 seconds
- API response time: < 500ms
- Real-time updates: < 2 seconds latency
- Support 10,000+ concurrent users

### 5.2 Security
- End-to-end encryption for sensitive data
- HTTPS for all communications
- Role-based access control (RBAC)
- Secure authentication with JWT
- Data encryption at rest

### 5.3 Availability
- 99.5% uptime SLA
- Graceful degradation for offline mode
- Automatic failover mechanisms

### 5.4 Scalability
- Horizontal scaling capability
- Database sharding ready
- CDN for static assets
- Microservices-ready architecture

### 5.5 Offline Support
- Riders can work offline in low-connectivity areas
- Data syncs when connection restored
- Offline queue for status updates
- Local storage for critical data

---

## 6. Success Metrics

### 6.1 Key Performance Indicators (KPIs)
| Metric | Target | Measurement |
|--------|--------|-------------|
| User Registration | 1000+ users/month | Monthly signups |
| Order Completion Rate | > 95% | Completed/Total orders |
| Average Delivery Time | < 45 mins (urban) | Time from pickup to delivery |
| Customer Satisfaction | > 4.5/5 | Average rating |
| Platform Uptime | > 99.5% | Monthly availability |
| Rider Utilization | > 70% | Active time/Online time |

---

## 7. Constraints & Assumptions

### 7.1 Constraints
- Must work on low-bandwidth networks (2G/3G)
- Must support low-end Android devices
- Must comply with Nigerian data protection laws (NDPR)
- Budget limitations for third-party services

### 7.2 Assumptions
- Users have smartphones with GPS capability
- Basic internet connectivity available
- Users can read English or local languages
- Riders have valid identification documents
