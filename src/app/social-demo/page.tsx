"use client";

import React from "react";
import {
  UserProfileCard,
  StudyGroupCard,
  sampleUserProfile,
  sampleStudyGroups,
  type UserProfile,
  type StudyGroup,
} from "@/components/social";

export default function SocialDemo() {
  const [followingUsers, setFollowingUsers] = React.useState<string[]>([]);
  const [joinedGroups, setJoinedGroups] = React.useState<string[]>(["2"]);

  // Sample additional users
  const additionalUsers: UserProfile[] = [
    {
      ...sampleUserProfile,
      id: "2",
      username: "codequeen",
      displayName: "Ayşe Demir",
      bio: "Full-stack developer ve Python tutkunu. Open source projelere katkıda bulunmayı seviyorum.",
      location: "Ankara, Türkiye",
      isOnline: false,
      lastSeen: new Date(Date.now() - 3600000),
      totalXP: 8500,
      currentLevel: 12,
      completedLessons: 32,
      completedExercises: 89,
      currentStreak: 5,
      longestStreak: 15,
      averageScore: 91,
      followers: 156,
      following: 43,
      topSkills: ["Python", "React", "Node.js", "PostgreSQL"],
    },
    {
      ...sampleUserProfile,
      id: "3",
      username: "mlexpert",
      displayName: "Mehmet Öz",
      bio: "Machine Learning engineer ve data scientist. AI konularında mentorluk yapıyorum.",
      location: "İzmir, Türkiye",
      isOnline: true,
      totalXP: 25000,
      currentLevel: 22,
      completedLessons: 78,
      completedExercises: 245,
      currentStreak: 25,
      longestStreak: 45,
      averageScore: 94,
      followers: 892,
      following: 123,
      topSkills: ["Python", "TensorFlow", "Scikit-learn", "Pandas"],
    },
  ];

  const handleFollow = (userId: string) => {
    setFollowingUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleJoinGroup = (groupId: string) => {
    setJoinedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const allUsers = [sampleUserProfile, ...additionalUsers].map((user) => ({
    ...user,
    isFollowing: followingUsers.includes(user.id),
  }));

  const allGroups = sampleStudyGroups.map((group) => ({
    ...group,
    isMember: joinedGroups.includes(group.id),
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          🤝 Social Features Demo
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Kullanıcı profilleri ve çalışma grupları için sosyal özellikler
        </p>

        {/* User Profile Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            👤 Kullanıcı Profil Kartları
          </h2>

          {/* Different Variants */}
          <div className="space-y-12">
            {/* Mini Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">
                Mini Variant (Öneriler için)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allUsers.map((user) => (
                  <UserProfileCard
                    key={`mini-${user.id}`}
                    profile={user}
                    variant="mini"
                    showActions={false}
                    onViewProfile={() =>
                      console.log("View profile:", user.username)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Compact Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">
                Compact Variant (Listeler için)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allUsers.map((user) => (
                  <UserProfileCard
                    key={`compact-${user.id}`}
                    profile={user}
                    variant="compact"
                    onFollow={() => handleFollow(user.id)}
                    onMessage={() => console.log("Message:", user.username)}
                    onViewProfile={() =>
                      console.log("View profile:", user.username)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Default Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">
                Default Variant (Profil sayfaları için)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allUsers.map((user) => (
                  <UserProfileCard
                    key={`default-${user.id}`}
                    profile={user}
                    variant="default"
                    onFollow={() => handleFollow(user.id)}
                    onMessage={() => console.log("Message:", user.username)}
                    onViewProfile={() =>
                      console.log("View profile:", user.username)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Detailed Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">
                Detailed Variant (Detaylı profil görünümü)
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {allUsers.slice(0, 2).map((user) => (
                  <UserProfileCard
                    key={`detailed-${user.id}`}
                    profile={user}
                    variant="detailed"
                    onFollow={() => handleFollow(user.id)}
                    onMessage={() => console.log("Message:", user.username)}
                    onViewProfile={() =>
                      console.log("View profile:", user.username)
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Study Group Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            👥 Çalışma Grubu Kartları
          </h2>

          <div className="space-y-12">
            {/* Compact Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">
                Compact Variant (Listeler için)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allGroups.map((group) => (
                  <StudyGroupCard
                    key={`compact-${group.id}`}
                    group={group}
                    variant="compact"
                    onJoin={() => handleJoinGroup(group.id)}
                    onView={() => console.log("View group:", group.name)}
                    onMessage={() => console.log("Group chat:", group.name)}
                  />
                ))}
              </div>
            </div>

            {/* Default Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">
                Default Variant (Ana sayfa için)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allGroups.map((group) => (
                  <StudyGroupCard
                    key={`default-${group.id}`}
                    group={group}
                    variant="default"
                    onJoin={() => handleJoinGroup(group.id)}
                    onView={() => console.log("View group:", group.name)}
                    onMessage={() => console.log("Group chat:", group.name)}
                  />
                ))}
              </div>
            </div>

            {/* Featured Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-700">
                Featured Variant (Öne çıkan gruplar)
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {allGroups.map((group) => (
                  <StudyGroupCard
                    key={`featured-${group.id}`}
                    group={group}
                    variant="featured"
                    onJoin={() => handleJoinGroup(group.id)}
                    onView={() => console.log("View group:", group.name)}
                    onMessage={() => console.log("Group chat:", group.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Features Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">
            🎮 İnteraktif Özellikler
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Following Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Takip Durumu</h3>
              <div className="space-y-3">
                {allUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {user.displayName.charAt(0)}
                      </div>
                      <span className="font-medium">{user.displayName}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.isFollowing
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.isFollowing ? "Takip Ediliyor" : "Takip Edilmiyor"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Group Membership */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Grup Üyeliği</h3>
              <div className="space-y-3">
                {allGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                        {group.name.charAt(0)}
                      </div>
                      <span className="font-medium">{group.name}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        group.isMember
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {group.isMember ? "Üye" : "Üye Değil"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Summary */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-semibold mb-6">
            📊 Demo İstatistikleri
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{allUsers.length}</div>
              <div className="text-sm opacity-90">Toplam Kullanıcı</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {followingUsers.length}
              </div>
              <div className="text-sm opacity-90">Takip Edilen</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{allGroups.length}</div>
              <div className="text-sm opacity-90">Toplam Grup</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {joinedGroups.length}
              </div>
              <div className="text-sm opacity-90">Katılınan Grup</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
