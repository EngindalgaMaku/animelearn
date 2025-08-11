-- CreateTable
CREATE TABLE "arena_configurations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arena_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arena_difficulty_configs" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT 'from-slate-500 to-slate-600',
    "icon" TEXT NOT NULL DEFAULT '💻',
    "bgColor" TEXT NOT NULL DEFAULT 'bg-slate-50',
    "textColor" TEXT NOT NULL DEFAULT 'text-slate-700',
    "borderColor" TEXT NOT NULL DEFAULT 'border-slate-200',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arena_difficulty_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arena_category_configs" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '💻',
    "gradient" TEXT NOT NULL DEFAULT 'from-slate-500 to-slate-600',
    "bgGradient" TEXT NOT NULL DEFAULT 'from-slate-50 to-slate-50',
    "iconBg" TEXT NOT NULL DEFAULT 'bg-slate-500',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arena_category_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arena_activity_type_configs" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '💻',
    "color" TEXT NOT NULL DEFAULT 'text-slate-600',
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arena_activity_type_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "arena_ui_configs" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL DEFAULT 'Master Programming',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Through Epic Learning',
    "heroDescription" TEXT NOT NULL DEFAULT 'Embark on an epic coding adventure with interactive challenges, unlock achievements, and build world-class programming skills!',
    "primaryColor" TEXT NOT NULL DEFAULT '#6366f1',
    "secondaryColor" TEXT NOT NULL DEFAULT '#ec4899',
    "accentColor" TEXT NOT NULL DEFAULT '#06b6d4',
    "backgroundColor" TEXT NOT NULL DEFAULT 'from-indigo-50 via-white to-cyan-50',
    "headerGradient" TEXT NOT NULL DEFAULT 'from-indigo-600 via-purple-600 to-pink-600',
    "customCSS" TEXT,
    "showStats" BOOLEAN NOT NULL DEFAULT true,
    "showFilters" BOOLEAN NOT NULL DEFAULT true,
    "enableAnimations" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arena_ui_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "arena_configurations_name_key" ON "arena_configurations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "arena_difficulty_configs_configId_level_key" ON "arena_difficulty_configs"("configId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "arena_category_configs_configId_key_key" ON "arena_category_configs"("configId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "arena_activity_type_configs_configId_type_key" ON "arena_activity_type_configs"("configId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "arena_ui_configs_configId_key" ON "arena_ui_configs"("configId");

-- AddForeignKey
ALTER TABLE "arena_difficulty_configs" ADD CONSTRAINT "arena_difficulty_configs_configId_fkey" FOREIGN KEY ("configId") REFERENCES "arena_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arena_category_configs" ADD CONSTRAINT "arena_category_configs_configId_fkey" FOREIGN KEY ("configId") REFERENCES "arena_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arena_activity_type_configs" ADD CONSTRAINT "arena_activity_type_configs_configId_fkey" FOREIGN KEY ("configId") REFERENCES "arena_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "arena_ui_configs" ADD CONSTRAINT "arena_ui_configs_configId_fkey" FOREIGN KEY ("configId") REFERENCES "arena_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;