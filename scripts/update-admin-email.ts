import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateAdminEmail() {
  try {
    console.log('Updating admin email to mackaengin@gmail.com...')
    
    // Find the admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    })
    
    if (!adminUser) {
      console.log('No admin user found. Creating admin user...')
      
      // Create admin user if doesn't exist
      const newAdmin = await prisma.user.create({
        data: {
          email: 'mackaengin@gmail.com',
          username: 'admin',
          passwordHash: 'admin123', // TODO: Use proper hashing
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          isActive: true,
          emailVerified: true,
          level: 100,
          experience: 10000,
          currentDiamonds: 10000,
          totalDiamonds: 10000
        }
      })
      
      console.log('Admin user created:', newAdmin.email)
    } else {
      // Update existing admin email
      const updatedAdmin = await prisma.user.update({
        where: { id: adminUser.id },
        data: { 
          email: 'mackaengin@gmail.com',
          emailVerified: true 
        }
      })
      
      console.log('Admin email updated from', adminUser.email, 'to', updatedAdmin.email)
    }
    
    console.log('Admin email update completed successfully!')
  } catch (error) {
    console.error('Error updating admin email:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminEmail()