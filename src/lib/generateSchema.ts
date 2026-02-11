import type { TermsGeneratorInput, DBSchema, DBTable } from "@/types";

function buildUserTable(input: TermsGeneratorInput): DBTable {
  const columns = [
    {
      name: "id",
      type: "BIGINT",
      nullable: false,
      description: "사용자 고유 식별자 (PK, AUTO_INCREMENT)",
      isPrimaryKey: true,
    },
    {
      name: "uuid",
      type: "CHAR(36)",
      nullable: false,
      description: "외부 노출용 UUID (공개 API에서 사용)",
    },
  ];

  // 인증 방식에 따른 컬럼
  if (input.authMethods.includes("email")) {
    columns.push(
      {
        name: "email",
        type: "VARCHAR(255)",
        nullable: false,
        description: "이메일 주소 (UNIQUE, 로그인 ID로 사용)",
      },
      {
        name: "password_hash",
        type: "VARCHAR(255)",
        nullable: true,
        description: "비밀번호 해시 (bcrypt 등, 소셜 로그인 시 NULL 가능)",
      },
      {
        name: "email_verified_at",
        type: "TIMESTAMP",
        nullable: true,
        description: "이메일 인증 완료 시각",
      }
    );
  }

  if (input.authMethods.includes("phone")) {
    columns.push(
      {
        name: "phone",
        type: "VARCHAR(20)",
        nullable: true,
        description: "휴대전화 번호 (암호화 저장)",
      },
      {
        name: "phone_verified_at",
        type: "TIMESTAMP",
        nullable: true,
        description: "휴대전화 인증 완료 시각",
      }
    );
  }

  // 소셜 로그인
  if (input.authMethods.some((m) => m.startsWith("social_"))) {
    columns.push({
      name: "auth_provider",
      type: "VARCHAR(20)",
      nullable: true,
      description: "소셜 로그인 제공자 (kakao, naver, google, apple)",
    });
    columns.push({
      name: "auth_provider_id",
      type: "VARCHAR(255)",
      nullable: true,
      description: "소셜 로그인 제공자의 고유 사용자 ID",
    });
  }

  // 수집 정보에 따른 컬럼
  if (input.collectableInfos.includes("name")) {
    columns.push({
      name: "name",
      type: "VARCHAR(100)",
      nullable: true,
      description: "이름 (암호화 저장 권장)",
    });
  }

  if (input.collectableInfos.includes("nickname")) {
    columns.push({
      name: "nickname",
      type: "VARCHAR(50)",
      nullable: true,
      description: "닉네임 (UNIQUE)",
    });
  }

  if (input.collectableInfos.includes("birthdate")) {
    columns.push({
      name: "birthdate",
      type: "DATE",
      nullable: true,
      description: "생년월일",
    });
  }

  if (input.collectableInfos.includes("gender")) {
    columns.push({
      name: "gender",
      type: "ENUM('M','F','O')",
      nullable: true,
      description: "성별 (M: 남성, F: 여성, O: 기타)",
    });
  }

  if (input.collectableInfos.includes("address")) {
    columns.push(
      {
        name: "address",
        type: "TEXT",
        nullable: true,
        description: "주소",
      },
      {
        name: "address_detail",
        type: "VARCHAR(255)",
        nullable: true,
        description: "상세 주소",
      },
      {
        name: "zipcode",
        type: "VARCHAR(10)",
        nullable: true,
        description: "우편번호",
      }
    );
  }

  if (input.collectableInfos.includes("profile_image")) {
    columns.push({
      name: "profile_image_url",
      type: "VARCHAR(500)",
      nullable: true,
      description: "프로필 이미지 URL",
    });
  }

  // 공통 컬럼
  columns.push(
    {
      name: "status",
      type: "ENUM('active','inactive','suspended','withdrawn')",
      nullable: false,
      description: "계정 상태",
      defaultValue: "'active'",
    },
    {
      name: "last_login_at",
      type: "TIMESTAMP",
      nullable: true,
      description: "마지막 로그인 시각",
    },
    {
      name: "created_at",
      type: "TIMESTAMP",
      nullable: false,
      description: "가입 일시",
      defaultValue: "CURRENT_TIMESTAMP",
    },
    {
      name: "updated_at",
      type: "TIMESTAMP",
      nullable: false,
      description: "정보 수정 일시",
      defaultValue: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    },
    {
      name: "withdrawn_at",
      type: "TIMESTAMP",
      nullable: true,
      description: "탈퇴 일시",
    }
  );

  return {
    name: "users",
    description: "회원 정보 테이블",
    columns,
  };
}

function buildAgreementLogTable(): DBTable {
  return {
    name: "user_agreement_logs",
    description:
      "약관 동의 로그 테이블 - 동의 이력을 불변(Immutable)으로 기록합니다. 법적 분쟁 시 증빙 자료로 활용됩니다.",
    columns: [
      {
        name: "id",
        type: "BIGINT",
        nullable: false,
        description: "로그 고유 식별자 (PK, AUTO_INCREMENT)",
        isPrimaryKey: true,
      },
      {
        name: "user_id",
        type: "BIGINT",
        nullable: false,
        description: "사용자 ID (FK → users.id)",
        isForeignKey: true,
      },
      {
        name: "agreement_type",
        type: "VARCHAR(50)",
        nullable: false,
        description:
          "약관 유형 (service_terms, privacy_policy, marketing, third_party, minor_consent)",
      },
      {
        name: "agreed",
        type: "BOOLEAN",
        nullable: false,
        description: "동의 여부 (true/false)",
      },
      {
        name: "agreement_version",
        type: "VARCHAR(20)",
        nullable: false,
        description: "동의한 약관의 버전 (예: v1.0.0)",
      },
      {
        name: "agreed_at",
        type: "TIMESTAMP",
        nullable: false,
        description: "동의 시각",
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "agreed_ip",
        type: "VARCHAR(45)",
        nullable: false,
        description: "동의 시 IP 주소 (IPv6 대응)",
      },
      {
        name: "user_agent",
        type: "TEXT",
        nullable: true,
        description: "동의 시 User-Agent (브라우저/앱 정보)",
      },
    ],
  };
}

function buildMarketingConsentTable(): DBTable {
  return {
    name: "user_marketing_consents",
    description:
      "마케팅 수신 동의 테이블 - 약관 동의 로그와 분리하여 현재 상태를 관리합니다. 수신 거부 즉시 반영을 위한 구조입니다.",
    columns: [
      {
        name: "id",
        type: "BIGINT",
        nullable: false,
        description: "고유 식별자 (PK, AUTO_INCREMENT)",
        isPrimaryKey: true,
      },
      {
        name: "user_id",
        type: "BIGINT",
        nullable: false,
        description: "사용자 ID (FK → users.id, UNIQUE)",
        isForeignKey: true,
      },
      {
        name: "email_consent",
        type: "BOOLEAN",
        nullable: false,
        description: "이메일 수신 동의",
        defaultValue: "false",
      },
      {
        name: "sms_consent",
        type: "BOOLEAN",
        nullable: false,
        description: "SMS 수신 동의",
        defaultValue: "false",
      },
      {
        name: "push_consent",
        type: "BOOLEAN",
        nullable: false,
        description: "푸시 알림 수신 동의",
        defaultValue: "false",
      },
      {
        name: "consented_at",
        type: "TIMESTAMP",
        nullable: true,
        description: "최초 동의 시각",
      },
      {
        name: "updated_at",
        type: "TIMESTAMP",
        nullable: false,
        description: "마지막 변경 시각",
        defaultValue: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      },
    ],
  };
}

function buildWithdrawalTable(): DBTable {
  return {
    name: "user_withdrawals",
    description:
      "회원 탈퇴 기록 테이블 - 탈퇴 사유 분석 및 법적 보관 의무 충족을 위한 테이블입니다.",
    columns: [
      {
        name: "id",
        type: "BIGINT",
        nullable: false,
        description: "고유 식별자 (PK, AUTO_INCREMENT)",
        isPrimaryKey: true,
      },
      {
        name: "user_id",
        type: "BIGINT",
        nullable: false,
        description: "사용자 ID",
      },
      {
        name: "reason",
        type: "VARCHAR(50)",
        nullable: true,
        description:
          "탈퇴 사유 코드 (not_useful, too_many_ads, privacy_concern, other)",
      },
      {
        name: "reason_detail",
        type: "TEXT",
        nullable: true,
        description: "탈퇴 상세 사유 (자유 입력)",
      },
      {
        name: "withdrawn_at",
        type: "TIMESTAMP",
        nullable: false,
        description: "탈퇴 일시",
        defaultValue: "CURRENT_TIMESTAMP",
      },
      {
        name: "data_deletion_scheduled_at",
        type: "TIMESTAMP",
        nullable: true,
        description: "개인정보 삭제 예정 일시 (보관 기간 후)",
      },
    ],
  };
}

function generateSQL(tables: DBTable[], input: TermsGeneratorInput): string {
  let sql = `-- ============================================
-- JoinKit 자동 생성 DB 스키마
-- 서비스: ${input.serviceName}
-- 생성일: ${new Date().toISOString().split("T")[0]}
-- ============================================
-- ※ 이 SQL은 참고용 초안이며,
--   실제 운영 환경에 맞게 조정이 필요합니다.
-- ============================================

`;

  for (const table of tables) {
    sql += `-- ${table.description}\n`;
    sql += `CREATE TABLE ${table.name} (\n`;

    const colDefs: string[] = [];
    const pkCols: string[] = [];
    const fkCols: string[] = [];
    const uniqueCols: string[] = [];

    for (const col of table.columns) {
      let def = `  ${col.name} ${col.type}`;
      if (!col.nullable) def += " NOT NULL";
      if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;
      if (col.isPrimaryKey) {
        def += " AUTO_INCREMENT";
        pkCols.push(col.name);
      }
      def += ` -- ${col.description}`;
      colDefs.push(def);

      // UNIQUE 컬럼 식별
      if (
        col.description.includes("UNIQUE") ||
        col.name === "uuid" ||
        col.name === "email"
      ) {
        uniqueCols.push(col.name);
      }

      if (col.isForeignKey) {
        fkCols.push(col.name);
      }
    }

    sql += colDefs.join(",\n");

    if (pkCols.length > 0) {
      sql += `,\n  PRIMARY KEY (${pkCols.join(", ")})`;
    }

    for (const uc of uniqueCols) {
      sql += `,\n  UNIQUE KEY uk_${table.name}_${uc} (${uc})`;
    }

    for (const fk of fkCols) {
      sql += `,\n  FOREIGN KEY (${fk}) REFERENCES users(id) ON DELETE CASCADE`;
    }

    sql += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    // 인덱스
    if (table.name === "user_agreement_logs") {
      sql += `CREATE INDEX idx_agreement_user ON ${table.name} (user_id, agreement_type);\n`;
      sql += `CREATE INDEX idx_agreement_type_version ON ${table.name} (agreement_type, agreement_version);\n\n`;
    }
    if (table.name === "users") {
      if (input.authMethods.some((m) => m.startsWith("social_"))) {
        sql += `CREATE INDEX idx_users_auth_provider ON ${table.name} (auth_provider, auth_provider_id);\n`;
      }
      sql += `CREATE INDEX idx_users_status ON ${table.name} (status);\n`;
      sql += `CREATE INDEX idx_users_created ON ${table.name} (created_at);\n\n`;
    }
  }

  return sql;
}

// ===== 메인 생성 함수 =====
export function generateSchema(input: TermsGeneratorInput): DBSchema {
  const tables: DBTable[] = [
    buildUserTable(input),
    buildAgreementLogTable(),
  ];

  if (input.hasMarketing) {
    tables.push(buildMarketingConsentTable());
  }

  tables.push(buildWithdrawalTable());

  const sql = generateSQL(tables, input);

  let retentionPolicy = `## 개인정보 보관 및 삭제 기준

### 즉시 삭제 (회원 탈퇴 시)
- users 테이블의 개인정보 (이메일, 이름, 전화번호 등)
- 프로필 이미지 파일
${input.hasMarketing ? "- user_marketing_consents 레코드" : ""}

### 보관 후 삭제
- user_agreement_logs: 동의 이력은 법적 분쟁 대비 **3년간 보관** 후 삭제
- user_withdrawals: 탈퇴 기록은 **1년간 보관** 후 삭제
`;

  if (input.hasPayment) {
    retentionPolicy += `
### 전자상거래법에 의한 보관
- 거래 기록: **5년**
- 결제 기록: **5년**
- 소비자 불만/분쟁 기록: **3년**
`;
  }

  retentionPolicy += `
### 구현 권장사항
1. 탈퇴 시 users 테이블의 개인정보는 **즉시 비식별화** (이메일, 이름 등 마스킹 또는 삭제)
2. 법적 보관 의무가 있는 데이터는 **별도 보관 테이블**로 이동
3. 보관 기간 만료 시 **자동 삭제 배치** 구성 권장
4. 개인정보 최소 수집 원칙: 서비스에 꼭 필요한 정보만 수집`;

  return {
    tables,
    sql,
    description: `${input.serviceName} 서비스를 위한 DB 스키마입니다. ${tables.length}개의 테이블로 구성됩니다.`,
    retentionPolicy,
  };
}
