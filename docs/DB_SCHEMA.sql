-- ============================================
-- JoinKit 표준 DB 스키마 (MySQL 8.0+)
-- 범용 회원가입 시스템
-- ============================================
-- ※ 이 SQL은 참고용 초안이며,
--   실제 운영 환경에 맞게 조정이 필요합니다.
-- ============================================

-- 1. 회원 정보 테이블
CREATE TABLE users (
  id            BIGINT        NOT NULL AUTO_INCREMENT,
  uuid          CHAR(36)      NOT NULL,                          -- 외부 노출용 UUID
  email         VARCHAR(255)  NOT NULL,                          -- 이메일 (로그인 ID)
  password_hash VARCHAR(255)  NULL,                              -- 비밀번호 해시 (소셜 로그인 시 NULL)
  name          VARCHAR(100)  NULL,                              -- 이름 (암호화 저장 권장)
  nickname      VARCHAR(50)   NULL,                              -- 닉네임
  phone         VARCHAR(20)   NULL,                              -- 휴대전화 (암호화 저장)
  birthdate     DATE          NULL,                              -- 생년월일
  gender        ENUM('M','F','O') NULL,                          -- 성별
  profile_image_url VARCHAR(500) NULL,                           -- 프로필 이미지 URL
  auth_provider    VARCHAR(20)  NULL,                            -- 소셜 로그인 제공자
  auth_provider_id VARCHAR(255) NULL,                            -- 소셜 제공자 사용자 ID
  email_verified_at TIMESTAMP  NULL,                             -- 이메일 인증 완료 시각
  phone_verified_at TIMESTAMP  NULL,                             -- 휴대전화 인증 완료 시각
  status        ENUM('active','inactive','suspended','withdrawn')
                NOT NULL DEFAULT 'active',                       -- 계정 상태
  last_login_at TIMESTAMP     NULL,                              -- 마지막 로그인
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  withdrawn_at  TIMESTAMP     NULL,                              -- 탈퇴 일시

  PRIMARY KEY (id),
  UNIQUE KEY uk_users_uuid (uuid),
  UNIQUE KEY uk_users_email (email),
  UNIQUE KEY uk_users_nickname (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_auth_provider ON users (auth_provider, auth_provider_id);
CREATE INDEX idx_users_status ON users (status);
CREATE INDEX idx_users_created ON users (created_at);

-- 2. 약관 동의 로그 테이블 (불변, Append-Only)
-- 법적 분쟁 시 증빙 자료로 활용
CREATE TABLE user_agreement_logs (
  id                BIGINT      NOT NULL AUTO_INCREMENT,
  user_id           BIGINT      NOT NULL,
  agreement_type    VARCHAR(50) NOT NULL,  -- service_terms, privacy_policy, marketing, third_party, minor_consent
  agreed            BOOLEAN     NOT NULL,
  agreement_version VARCHAR(20) NOT NULL,  -- v1.0.0, v1.1.0 등
  agreed_at         TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  agreed_ip         VARCHAR(45) NOT NULL,  -- IPv6 대응
  user_agent        TEXT        NULL,      -- 동의 시 브라우저/앱 정보

  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_agreement_user ON user_agreement_logs (user_id, agreement_type);
CREATE INDEX idx_agreement_type_version ON user_agreement_logs (agreement_type, agreement_version);

-- 3. 마케팅 수신 동의 테이블 (현재 상태 관리)
-- agreement_logs와 분리: 빠른 조회 + 즉시 수신거부 반영
CREATE TABLE user_marketing_consents (
  id            BIGINT    NOT NULL AUTO_INCREMENT,
  user_id       BIGINT    NOT NULL,
  email_consent BOOLEAN   NOT NULL DEFAULT FALSE,
  sms_consent   BOOLEAN   NOT NULL DEFAULT FALSE,
  push_consent  BOOLEAN   NOT NULL DEFAULT FALSE,
  consented_at  TIMESTAMP NULL,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uk_marketing_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 회원 탈퇴 기록 테이블
CREATE TABLE user_withdrawals (
  id              BIGINT      NOT NULL AUTO_INCREMENT,
  user_id         BIGINT      NOT NULL,
  reason          VARCHAR(50) NULL,   -- not_useful, too_many_ads, privacy_concern, other
  reason_detail   TEXT        NULL,
  withdrawn_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_deletion_scheduled_at TIMESTAMP NULL,  -- 보관 기간 후 삭제 예정일

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_withdrawal_user ON user_withdrawals (user_id);
CREATE INDEX idx_withdrawal_scheduled ON user_withdrawals (data_deletion_scheduled_at);

-- ============================================
-- 보관 및 삭제 기준
-- ============================================
-- [즉시 삭제] 회원 탈퇴 시
--   - users 테이블 개인정보 비식별화 (이메일, 이름, 전화번호 마스킹)
--   - 프로필 이미지 파일 삭제
--   - user_marketing_consents 레코드 삭제
--
-- [보관 후 삭제]
--   - user_agreement_logs: 3년 보관 후 삭제 (법적 분쟁 대비)
--   - user_withdrawals: 1년 보관 후 삭제
--
-- [전자상거래법 보관] (쇼핑몰의 경우)
--   - 거래 기록: 5년
--   - 결제 기록: 5년
--   - 소비자 불만/분쟁: 3년
-- ============================================
