import { prisma } from '../src/lib/prisma'

async function createAdminUser() {
  try {
    // Check if admin user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@zumenzu.com' }
    })

    if (existingUser) {
      console.log('Admin user already exists, updating role...')
      
      // Update existing user to admin
      const updatedUser = await prisma.user.update({
        where: { email: 'admin@zumenzu.com' },
        data: {
          role: 'admin',
          username: 'admin'
        }
      })
      
      console.log('✅ Updated user:', updatedUser)
    } else {
      console.log('Creating new admin user...')
      
      // Create new admin user
      const newUser = await prisma.user.create({
        data: {
          email: 'admin@zumenzu.com',
          username: 'admin',
          role: 'admin',
          level: 99,
          experience: 999999,
          currentDiamonds: 999999,
          totalDiamonds: 999999,
          isPremium: true,
          isActive: true,
          emailVerified: true
        }
      })
      
      console.log('✅ Created admin user:', newUser)
    }
    
    // Verify the user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@zumenzu.com' },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        level: true,
        isActive: true
      }
    })
    
    console.log('🔍 Final admin user:', adminUser)
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()