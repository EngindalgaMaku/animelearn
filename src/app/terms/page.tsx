import React from "react";
import { Shield, FileText, Users, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-4 text-lg text-gray-600">
            Rules and terms you must follow when using the Zumenzu platform
          </p>
          <div className="mt-4 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <strong>Last Updated:</strong> August 4, 2024
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {/* 1. Service Description */}
          <section className="rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                1. Service Description
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Zumenzu is an educational platform that supports your Python
                programming learning through gamification elements. The platform
                offers the following services:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Interactive Python programming lessons</li>
                <li>Anime card collection system</li>
                <li>Daily quests and challenges</li>
                <li>Badge and achievement system</li>
                <li>Code editor and real-time code execution</li>
                <li>Community features and social interaction</li>
              </ul>
            </div>
          </section>

          {/* 2. User Responsibilities */}
          <section className="rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                2. User Responsibilities
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                We expect you to follow these rules when using the platform:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Provide accurate and current information during registration
                </li>
                <li>
                  Protect your account security and keep your password
                  confidential
                </li>
                <li>Use the platform only for legal purposes</li>
                <li>Treat other users with respect</li>
                <li>Do not violate copyright</li>
                <li>
                  Do not share spam, malicious code or inappropriate content
                </li>
                <li>Do not attempt to manipulate the system</li>
              </ul>
            </div>
          </section>

          {/* 3. Account and Security */}
          <section className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              3. Account and Security
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Account Creation:</strong> When creating an account on
                Zumenzu, you must use your real information. One person can only
                create one account.
              </p>
              <p>
                <strong>Account Security:</strong> You are responsible for the
                security of your account. Keep your password strong and don't
                share it with anyone. If you notice suspicious activity on your
                account, please notify us immediately.
              </p>
              <p>
                <strong>Account Termination:</strong> Accounts that violate the
                terms of use may be suspended or deleted without warning.
              </p>
            </div>
          </section>

          {/* 4. Content and Copyright */}
          <section className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              4. Content and Copyright
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Platform Content:</strong> All educational materials,
                anime cards, codes and other content on Zumenzu are protected by
                copyright.
              </p>
              <p>
                <strong>User Content:</strong> The codes and content you create
                on the platform belong to you, but you grant us the right to
                share them on the platform.
              </p>
              <p>
                <strong>Anime Characters:</strong> The anime characters and
                visuals used on the platform are used solely for educational
                purposes and the copyrights of their respective owners are
                reserved.
              </p>
            </div>
          </section>

          {/* 5. Virtual Currency and Cards */}
          <section className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              5. Virtual Currency and Cards
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Diamonds:</strong> The diamonds you earn within the
                platform are virtual currency and have no value in the real
                world. Diamonds cannot be withdrawn from the platform or
                converted to real money.
              </p>
              <p>
                <strong>Anime Cards:</strong> The anime cards you collect are
                digital collection items. These cards have no value outside the
                platform.
              </p>
              <p>
                <strong>Account Deletion:</strong> If you delete your account,
                all your virtual assets (diamonds, cards, badges) will be
                permanently deleted and cannot be recovered.
              </p>
            </div>
          </section>

          {/* 6. Privacy */}
          <section className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              6. Privacy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Protecting your personal data is important to us. Our privacy
                policy explains in detail the data we collect, how we use it and
                how we protect it.
              </p>
              <p>
                Data collected during your use of the platform is used solely to
                improve service quality and provide you with a better
                experience.
              </p>
            </div>
          </section>

          {/* 7. Disclaimer */}
          <section className="rounded-lg bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                7. Disclaimer
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                The Zumenzu platform is provided "as is". We do not guarantee
                that the service will be uninterrupted or error-free.
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Interruptions caused by technical failures or system
                  maintenance
                </li>
                <li>Problems arising from third-party services</li>
                <li>Data loss caused by user errors</li>
                <li>Actions of other users on the platform</li>
              </ul>
              <p>
                We disclaim responsibility for any damage that may arise from
                these situations.
              </p>
            </div>
          </section>

          {/* 8. Changes */}
          <section className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              8. Changes to Terms
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We may update these terms of use when necessary. We will notify
                you of important changes by email or by announcement on the
                platform.
              </p>
              <p>
                Your continued use of the platform after the changes take effect
                means that you accept the new terms.
              </p>
            </div>
          </section>

          {/* 9. Contact */}
          <section className="rounded-lg bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              9. Contact
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                If you have questions about these terms of use, you can contact
                us:
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p>
                  <strong>Email:</strong> info@zumenzu.com
                </p>
                <p>
                  <strong>Support:</strong> support@zumenzu.com
                </p>
                <p>
                  <strong>Legal Questions:</strong> legal@zumenzu.com
                </p>
              </div>
            </div>
          </section>

          {/* Acceptance Declaration */}
          <section className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <h2 className="mb-4 text-2xl font-bold">Acceptance Declaration</h2>
            <p className="text-blue-100">
              By using the Zumenzu platform, you declare that you have read,
              understood and accepted all the above terms of use. Use that does
              not comply with these terms may result in your account being
              suspended or deleted.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
