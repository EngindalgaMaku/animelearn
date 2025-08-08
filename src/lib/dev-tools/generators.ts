/**
 * Code generation utilities for scaffolding components, pages, and features
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

// Template interfaces
interface ComponentTemplate {
  name: string;
  type: "component" | "page" | "hook" | "utility";
  props?: string[];
  hasStyles?: boolean;
  hasStory?: boolean;
  hasTest?: boolean;
}

interface FeatureTemplate {
  name: string;
  components: string[];
  pages: string[];
  hooks: string[];
  utilities: string[];
}

/**
 * Generate a React component
 */
export const generateComponent = (
  name: string,
  options: {
    directory?: string;
    props?: string[];
    hasStyles?: boolean;
    hasStory?: boolean;
    hasTest?: boolean;
    typescript?: boolean;
  } = {}
): void => {
  const {
    directory = "src/components",
    props = [],
    hasStyles = true,
    hasStory = true,
    hasTest = true,
    typescript = true,
  } = options;

  const componentDir = join(directory, kebabCase(name));
  const fileName = `${name}.${typescript ? "tsx" : "jsx"}`;

  // Create directory if it doesn't exist
  if (!existsSync(componentDir)) {
    mkdirSync(componentDir, { recursive: true });
  }

  // Generate component file
  const componentContent = generateComponentContent(
    name,
    props,
    typescript,
    hasStyles
  );
  writeFileSync(join(componentDir, fileName), componentContent);

  // Generate index file
  const indexContent = generateIndexContent(name, typescript);
  writeFileSync(
    join(componentDir, `index.${typescript ? "ts" : "js"}`),
    indexContent
  );

  // Generate styles if requested
  if (hasStyles) {
    const stylesContent = generateStylesContent(name);
    writeFileSync(join(componentDir, `${name}.module.css`), stylesContent);
  }

  // Generate story if requested
  if (hasStory) {
    const storyContent = generateStoryContent(name, props, typescript);
    writeFileSync(
      join(componentDir, `${name}.stories.${typescript ? "tsx" : "jsx"}`),
      storyContent
    );
  }

  // Generate test if requested
  if (hasTest) {
    const testContent = generateTestContent(name, typescript);
    writeFileSync(
      join(componentDir, `${name}.test.${typescript ? "tsx" : "jsx"}`),
      testContent
    );
  }

  console.log(`✅ Generated component: ${name}`);
};

/**
 * Generate a Storybook story
 */
export const generateStory = (
  componentName: string,
  options: {
    directory?: string;
    props?: string[];
    typescript?: boolean;
  } = {}
): void => {
  const {
    directory = "src/components",
    props = [],
    typescript = true,
  } = options;

  const storyPath = join(
    directory,
    kebabCase(componentName),
    `${componentName}.stories.${typescript ? "tsx" : "jsx"}`
  );
  const storyContent = generateStoryContent(componentName, props, typescript);

  writeFileSync(storyPath, storyContent);
  console.log(
    `✅ Generated story: ${componentName}.stories.${typescript ? "tsx" : "jsx"}`
  );
};

/**
 * Generate a test file
 */
export const generateTest = (
  componentName: string,
  options: {
    directory?: string;
    typescript?: boolean;
    testType?: "unit" | "integration" | "e2e";
  } = {}
): void => {
  const {
    directory = "src/components",
    typescript = true,
    testType = "unit",
  } = options;

  const testPath = join(
    directory,
    kebabCase(componentName),
    `${componentName}.test.${typescript ? "tsx" : "jsx"}`
  );
  const testContent = generateTestContent(componentName, typescript, testType);

  writeFileSync(testPath, testContent);
  console.log(
    `✅ Generated test: ${componentName}.test.${typescript ? "tsx" : "jsx"}`
  );
};

/**
 * Generate a Next.js page
 */
export const generatePage = (
  pageName: string,
  options: {
    directory?: string;
    hasLayout?: boolean;
    hasMetadata?: boolean;
    typescript?: boolean;
  } = {}
): void => {
  const {
    directory = "src/app",
    hasLayout = false,
    hasMetadata = true,
    typescript = true,
  } = options;

  const pageDir = join(directory, kebabCase(pageName));

  // Create directory if it doesn't exist
  if (!existsSync(pageDir)) {
    mkdirSync(pageDir, { recursive: true });
  }

  // Generate page file
  const pageContent = generatePageContent(pageName, hasMetadata, typescript);
  writeFileSync(
    join(pageDir, `page.${typescript ? "tsx" : "jsx"}`),
    pageContent
  );

  // Generate layout if requested
  if (hasLayout) {
    const layoutContent = generateLayoutContent(pageName, typescript);
    writeFileSync(
      join(pageDir, `layout.${typescript ? "tsx" : "jsx"}`),
      layoutContent
    );
  }

  console.log(`✅ Generated page: ${pageName}`);
};

/**
 * Scaffold a complete feature
 */
export const scaffoldFeature = (
  featureName: string,
  template: FeatureTemplate,
  options: {
    baseDirectory?: string;
    typescript?: boolean;
  } = {}
): void => {
  const { baseDirectory = "src", typescript = true } = options;

  const featureDir = join(baseDirectory, "features", kebabCase(featureName));

  // Create feature directory structure
  const directories = ["components", "pages", "hooks", "utils", "types", "api"];

  directories.forEach((dir) => {
    const dirPath = join(featureDir, dir);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  });

  // Generate components
  template.components.forEach((componentName) => {
    generateComponent(componentName, {
      directory: join(featureDir, "components"),
      typescript,
    });
  });

  // Generate pages
  template.pages.forEach((pageName) => {
    generatePage(pageName, {
      directory: join(featureDir, "pages"),
      typescript,
    });
  });

  // Generate hooks
  template.hooks.forEach((hookName) => {
    const hookContent = generateHookContent(hookName, typescript);
    writeFileSync(
      join(featureDir, "hooks", `${hookName}.${typescript ? "ts" : "js"}`),
      hookContent
    );
  });

  // Generate utilities
  template.utilities.forEach((utilName) => {
    const utilContent = generateUtilityContent(utilName, typescript);
    writeFileSync(
      join(featureDir, "utils", `${utilName}.${typescript ? "ts" : "js"}`),
      utilContent
    );
  });

  // Generate feature index
  const featureIndexContent = generateFeatureIndexContent(
    featureName,
    template,
    typescript
  );
  writeFileSync(
    join(featureDir, `index.${typescript ? "ts" : "js"}`),
    featureIndexContent
  );

  // Generate types file
  const typesContent = generateTypesContent(featureName, typescript);
  writeFileSync(
    join(featureDir, "types", `index.${typescript ? "ts" : "js"}`),
    typesContent
  );

  console.log(`✅ Scaffolded feature: ${featureName}`);
};

// Template content generators
const generateComponentContent = (
  name: string,
  props: string[],
  typescript: boolean,
  hasStyles: boolean = true
): string => {
  const propsInterface =
    typescript && props.length > 0
      ? `interface ${name}Props {\n${props
          .map((prop) => `  ${prop}: any;`)
          .join("\n")}\n}\n\n`
      : "";

  const propsParam =
    props.length > 0 ? (typescript ? `props: ${name}Props` : "props") : "";

  const stylesImport = hasStyles
    ? `import styles from './${name}.module.css';\n`
    : "";
  const className = hasStyles ? ` className={styles.${kebabCase(name)}}` : "";

  return `${
    typescript ? "import React from 'react';\n" : "import React from 'react';\n"
  }${stylesImport}
${propsInterface}export const ${name}${
    typescript ? `: React.FC${props.length > 0 ? `<${name}Props>` : ""}` : ""
  } = (${propsParam}) => {
  return (
    <div${className}>
      <h1>${name} Component</h1>
      {/* Add your component content here */}
    </div>
  );
};

export default ${name};
`;
};

const generateIndexContent = (name: string, typescript: boolean): string => {
  return `export { default as ${name} } from './${name}';
export type { ${name}Props } from './${name}';
`;
};

const generateStylesContent = (name: string): string => {
  return `.${kebabCase(name)} {
  /* Add your styles here */
}
`;
};

const generateStoryContent = (
  name: string,
  props: string[],
  typescript: boolean
): string => {
  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Add argTypes here
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default args here
  },
};

export const Example: Story = {
  args: {
    // Add example args here
  },
};
`;
};

const generateTestContent = (
  name: string,
  typescript: boolean,
  testType: string = "unit"
): string => {
  return `import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
    expect(screen.getByText('${name} Component')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<${name} />);
    // Add accessibility tests here
  });

  // Add more tests here
});
`;
};

const generatePageContent = (
  name: string,
  hasMetadata: boolean,
  typescript: boolean
): string => {
  const metadataExport = hasMetadata
    ? `
export const metadata${typescript ? ": Metadata" : ""} = {
  title: '${name}',
  description: '${name} page description',
};

`
    : "";

  return `${
    typescript && hasMetadata ? "import type { Metadata } from 'next';\n" : ""
  }import React from 'react';

${metadataExport}export default function ${name}Page() {
  return (
    <div>
      <h1>${name} Page</h1>
      {/* Add your page content here */}
    </div>
  );
}
`;
};

const generateLayoutContent = (name: string, typescript: boolean): string => {
  return `import React from 'react';

export default function ${name}Layout({
  children,
}${typescript ? ": {\n  children: React.ReactNode;\n}" : ""}) {
  return (
    <div>
      <header>
        <h1>${name} Layout</h1>
      </header>
      <main>{children}</main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}
`;
};

const generateHookContent = (name: string, typescript: boolean): string => {
  return `import { useState, useEffect } from 'react';

export const ${name} = ()${typescript ? ": any" : ""} => {
  const [state, setState] = useState${typescript ? "<any>" : ""}(null);

  useEffect(() => {
    // Add your hook logic here
  }, []);

  return {
    state,
    setState,
  };
};
`;
};

const generateUtilityContent = (name: string, typescript: boolean): string => {
  return `/**
 * ${name} utility functions
 */

export const ${camelCase(name)} = (param${typescript ? ": any" : ""})${
    typescript ? ": any" : ""
  } => {
  // Add your utility logic here
  return param;
};

export default {
  ${camelCase(name)},
};
`;
};

const generateFeatureIndexContent = (
  name: string,
  template: FeatureTemplate,
  typescript: boolean
): string => {
  const exports = [
    ...template.components.map(
      (comp) => `export { ${comp} } from './components/${comp}';`
    ),
    ...template.hooks.map(
      (hook) => `export { ${hook} } from './hooks/${hook}';`
    ),
    ...template.utilities.map(
      (util) => `export { default as ${util} } from './utils/${util}';`
    ),
  ];

  return `/**
 * ${name} Feature Module
 */

// Components
${template.components
  .map((comp) => `export { ${comp} } from './components/${comp}';`)
  .join("\n")}

// Hooks
${template.hooks
  .map((hook) => `export { ${hook} } from './hooks/${hook}';`)
  .join("\n")}

// Utils
${template.utilities
  .map((util) => `export { default as ${util} } from './utils/${util}';`)
  .join("\n")}

// Types
export type { ${name}Props } from './types';
`;
};

const generateTypesContent = (name: string, typescript: boolean): string => {
  if (!typescript) return "";

  return `/**
 * ${name} Feature Types
 */

export interface ${name}Props {
  // Add your types here
}

export interface ${name}State {
  // Add your state types here
}

export type ${name}Action = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
`;
};

// Utility functions
const kebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

const camelCase = (str: string): string => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
};

// Predefined templates
export const FEATURE_TEMPLATES = {
  crud: (entityName: string): FeatureTemplate => ({
    name: entityName,
    components: [
      `${entityName}List`,
      `${entityName}Card`,
      `${entityName}Form`,
      `${entityName}Details`,
    ],
    pages: [
      `${entityName}Page`,
      `${entityName}CreatePage`,
      `${entityName}EditPage`,
    ],
    hooks: [`use${entityName}`, `use${entityName}List`, `use${entityName}Form`],
    utilities: [
      `${entityName}Api`,
      `${entityName}Validation`,
      `${entityName}Utils`,
    ],
  }),

  dashboard: (dashboardName: string): FeatureTemplate => ({
    name: dashboardName,
    components: [
      `${dashboardName}Header`,
      `${dashboardName}Sidebar`,
      `${dashboardName}Widget`,
      `${dashboardName}Chart`,
    ],
    pages: [`${dashboardName}Page`],
    hooks: [`use${dashboardName}Data`, `use${dashboardName}Filters`],
    utilities: [`${dashboardName}Api`, `${dashboardName}Helpers`],
  }),

  auth: (): FeatureTemplate => ({
    name: "Auth",
    components: ["LoginForm", "RegisterForm", "UserProfile", "AuthGuard"],
    pages: ["LoginPage", "RegisterPage", "ProfilePage"],
    hooks: ["useAuth", "useLogin", "useRegister"],
    utilities: ["authApi", "authValidation", "tokenUtils"],
  }),
} as const;

// Export all generator functions
export const generators = {
  generateComponent,
  generateStory,
  generateTest,
  generatePage,
  scaffoldFeature,
  FEATURE_TEMPLATES,
};
