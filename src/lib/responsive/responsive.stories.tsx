import type { Meta, StoryObj } from "@storybook/react";
import { useBreakpoint } from "./hooks";
import {
  Container,
  Grid,
  Flex,
  Stack,
  Show,
  Hide,
  Padding,
} from "./components";

const meta: Meta = {
  title: "Responsive/System",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Responsive design system with breakpoint utilities, responsive components, and mobile-first approach for the anime Python learning platform.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Breakpoint Visualization
export const BreakpointVisualization: Story = {
  render: () => {
    const BreakpointIndicator = () => {
      const { current, isXs, isSm, isMd, isLg, isXl, is2Xl } = useBreakpoint();

      return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Current Breakpoint</h3>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-indigo-600">
              {current.toUpperCase()}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div
                className={`p-2 rounded ${
                  isXs ? "bg-green-100 text-green-800" : "bg-gray-100"
                }`}
              >
                📱 XS: {isXs ? "Active" : "Inactive"}
              </div>
              <div
                className={`p-2 rounded ${
                  isSm ? "bg-green-100 text-green-800" : "bg-gray-100"
                }`}
              >
                📟 SM: {isSm ? "Active" : "Inactive"}
              </div>
              <div
                className={`p-2 rounded ${
                  isMd ? "bg-green-100 text-green-800" : "bg-gray-100"
                }`}
              >
                💻 MD: {isMd ? "Active" : "Inactive"}
              </div>
              <div
                className={`p-2 rounded ${
                  isLg ? "bg-green-100 text-green-800" : "bg-gray-100"
                }`}
              >
                🖥️ LG: {isLg ? "Active" : "Inactive"}
              </div>
              <div
                className={`p-2 rounded ${
                  isXl ? "bg-green-100 text-green-800" : "bg-gray-100"
                }`}
              >
                🖥️ XL: {isXl ? "Active" : "Inactive"}
              </div>
              <div
                className={`p-2 rounded ${
                  is2Xl ? "bg-green-100 text-green-800" : "bg-gray-100"
                }`}
              >
                🖥️ 2XL: {is2Xl ? "Active" : "Inactive"}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-4">
              Resize your browser window to see breakpoint changes in real-time
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Responsive Breakpoints</h2>

        <div className="space-y-8">
          {/* Live Breakpoint Indicator */}
          <BreakpointIndicator />

          {/* Breakpoint Reference */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Breakpoint Reference</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Breakpoint</th>
                    <th className="text-left py-2">Min Width</th>
                    <th className="text-left py-2">Description</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b">
                    <td className="py-2 font-medium">XS</td>
                    <td className="py-2">320px</td>
                    <td className="py-2">Extra small devices</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">SM</td>
                    <td className="py-2">640px</td>
                    <td className="py-2">Small devices</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">MD</td>
                    <td className="py-2">768px</td>
                    <td className="py-2">Medium devices</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">LG</td>
                    <td className="py-2">1024px</td>
                    <td className="py-2">Large devices</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">XL</td>
                    <td className="py-2">1280px</td>
                    <td className="py-2">Extra large devices</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">2XL</td>
                    <td className="py-2">1536px</td>
                    <td className="py-2">Extra extra large devices</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// Responsive Grid System
export const ResponsiveGridSystem: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Responsive Grid System</h2>

      <div className="space-y-8">
        {/* Auto Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Responsive Grid</h3>
          <Grid cols={{ xs: 1, sm: 2, md: 3, lg: 4 }} className="gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-indigo-100 p-4 rounded-lg text-center">
                <div className="text-sm font-medium">Item {i + 1}</div>
              </div>
            ))}
          </Grid>
        </div>

        {/* Card Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Card Grid Layout</h3>
          <Grid
            cols={{ xs: 1, sm: 1, md: 2, lg: 3 }}
            gap={{ xs: "1rem", md: "1.5rem" }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg"
              >
                <div className="w-full h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg mb-4"></div>
                <h4 className="font-bold text-lg mb-2">Anime Card {i + 1}</h4>
                <p className="text-gray-600 text-sm">
                  Beautiful anime character card with responsive layout.
                </p>
              </div>
            ))}
          </Grid>
        </div>

        {/* Large Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-4">List Grid Layout</h3>
          <Grid cols={{ xs: 1, md: 2, lg: 3, xl: 4 }} className="gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 shadow-sm"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="font-medium">List Item {i + 1}</div>
                  <div className="text-sm text-gray-500">
                    Responsive list layout
                  </div>
                </div>
              </div>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  ),
};

// Responsive Components
export const ResponsiveComponents: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Responsive Components</h2>

      <div className="space-y-8">
        {/* Responsive Container */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Responsive Container</h3>
          <div className="space-y-4">
            <Container
              size="sm"
              className="bg-blue-50 border-2 border-dashed border-blue-300 p-6 rounded-lg"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2">Small Container</h4>
                <p className="text-gray-600">
                  Max-width optimized for reading content
                </p>
              </div>
            </Container>

            <Container
              size="lg"
              className="bg-green-50 border-2 border-dashed border-green-300 p-6 rounded-lg"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2">Large Container</h4>
                <p className="text-gray-600">
                  Balanced width for general content
                </p>
              </div>
            </Container>

            <Container
              size="full"
              className="bg-purple-50 border-2 border-dashed border-purple-300 p-6 rounded-lg"
            >
              <div className="text-center">
                <h4 className="font-bold text-lg mb-2">Full Width Container</h4>
                <p className="text-gray-600">
                  Full-width container for dashboard layouts
                </p>
              </div>
            </Container>
          </div>
        </div>

        {/* Responsive Flex */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Responsive Flex Layout</h3>
          <Flex
            direction={{ xs: "col", md: "row" }}
            gap={{ xs: "1rem", md: "2rem" }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="bg-indigo-100 p-4 rounded flex-1">
              <h4 className="font-medium">Flex Item 1</h4>
              <p className="text-sm text-gray-600">
                Stacked on mobile, side-by-side on desktop
              </p>
            </div>
            <div className="bg-pink-100 p-4 rounded flex-1">
              <h4 className="font-medium">Flex Item 2</h4>
              <p className="text-sm text-gray-600">
                Responsive direction changes
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded flex-1">
              <h4 className="font-medium">Flex Item 3</h4>
              <p className="text-sm text-gray-600">Adaptive spacing</p>
            </div>
          </Flex>
        </div>

        {/* Responsive Stack */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Responsive Stack</h3>
          <Stack
            spacing={{ xs: "0.5rem", md: "1rem", lg: "1.5rem" }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="bg-yellow-100 p-4 rounded">
              <h4 className="font-medium">Stack Item 1</h4>
              <p className="text-sm">Vertical layout with responsive spacing</p>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <h4 className="font-medium">Stack Item 2</h4>
              <p className="text-sm">Spacing increases on larger screens</p>
            </div>
            <div className="bg-blue-100 p-4 rounded">
              <h4 className="font-medium">Stack Item 3</h4>
              <p className="text-sm">Clean vertical alignment</p>
            </div>
          </Stack>
        </div>
      </div>
    </div>
  ),
};

// Show/Hide Components
export const ShowHideComponents: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Show/Hide Components</h2>

      <div className="space-y-8">
        {/* Show Above */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Show Above Breakpoint</h3>
          <div className="space-y-4">
            <Show above="md">
              <div className="bg-green-100 border border-green-300 p-4 rounded">
                <h4 className="font-medium text-green-800">
                  Visible on MD and above
                </h4>
                <p className="text-sm text-green-600">
                  This content only shows on medium screens and larger
                </p>
              </div>
            </Show>

            <Show above="lg">
              <div className="bg-blue-100 border border-blue-300 p-4 rounded">
                <h4 className="font-medium text-blue-800">
                  Visible on LG and above
                </h4>
                <p className="text-sm text-blue-600">
                  This content only shows on large screens and larger
                </p>
              </div>
            </Show>
          </div>
        </div>

        {/* Show Below */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Show Below Breakpoint</h3>
          <div className="space-y-4">
            <Show below="md">
              <div className="bg-orange-100 border border-orange-300 p-4 rounded">
                <h4 className="font-medium text-orange-800">
                  Visible on MD and below
                </h4>
                <p className="text-sm text-orange-600">
                  This content only shows on medium screens and smaller
                </p>
              </div>
            </Show>
          </div>
        </div>

        {/* Show Only */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">
            Show Only on Specific Breakpoint
          </h3>
          <div className="space-y-4">
            <Show only="sm">
              <div className="bg-purple-100 border border-purple-300 p-4 rounded">
                <h4 className="font-medium text-purple-800">
                  Visible only on SM
                </h4>
                <p className="text-sm text-purple-600">
                  This content only shows on small screens
                </p>
              </div>
            </Show>

            <Show only="lg">
              <div className="bg-indigo-100 border border-indigo-300 p-4 rounded">
                <h4 className="font-medium text-indigo-800">
                  Visible only on LG
                </h4>
                <p className="text-sm text-indigo-600">
                  This content only shows on large screens
                </p>
              </div>
            </Show>
          </div>
        </div>

        {/* Mobile vs Desktop Navigation */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">
            Responsive Navigation Pattern
          </h3>

          {/* Mobile Navigation */}
          <Show below="md">
            <div className="space-y-2">
              <div className="w-full bg-indigo-600 text-white text-center py-3 rounded font-medium">
                Dashboard
              </div>
              <div className="w-full bg-gray-100 text-center py-3 rounded">
                Learn
              </div>
              <div className="w-full bg-gray-100 text-center py-3 rounded">
                Cards
              </div>
              <div className="w-full bg-gray-100 text-center py-3 rounded">
                Profile
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">
                Mobile: Stacked Navigation
              </div>
            </div>
          </Show>

          {/* Desktop Navigation */}
          <Show above="md">
            <div>
              <div className="flex space-x-4">
                <div className="bg-indigo-600 text-white px-6 py-3 rounded font-medium">
                  Dashboard
                </div>
                <div className="bg-gray-100 px-6 py-3 rounded">Learn</div>
                <div className="bg-gray-100 px-6 py-3 rounded">Cards</div>
                <div className="bg-gray-100 px-6 py-3 rounded">Profile</div>
              </div>
              <div className="text-xs text-gray-500 text-center mt-2">
                Desktop: Horizontal Navigation
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  ),
};

// Responsive Padding
export const ResponsivePadding: Story = {
  render: () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Responsive Padding</h2>

      <div className="space-y-8">
        <div className="bg-white rounded-lg border border-gray-200">
          <Padding
            p={{ xs: "1rem", md: "2rem", lg: "3rem" }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50"
          >
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Responsive Padding</h3>
              <p className="text-gray-600">
                This container has responsive padding that increases on larger
                screens:
              </p>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-500 space-y-1">
                <li>XS-SM: 1rem padding</li>
                <li>MD: 2rem padding</li>
                <li>LG+: 3rem padding</li>
              </ul>
            </div>
          </Padding>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <Padding
            px={{ xs: "1rem", md: "2rem" }}
            py={{ xs: "0.5rem", md: "1rem" }}
            className="bg-gradient-to-r from-pink-50 to-yellow-50"
          >
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-2">Directional Padding</h3>
              <p className="text-gray-600">
                This container has different horizontal and vertical padding:
              </p>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-500 space-y-1">
                <li>Horizontal: 1rem (mobile) → 2rem (desktop)</li>
                <li>Vertical: 0.5rem (mobile) → 1rem (desktop)</li>
              </ul>
            </div>
          </Padding>
        </div>
      </div>
    </div>
  ),
};
