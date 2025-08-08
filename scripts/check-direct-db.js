const { Pool } = require('pg');

// PostgreSQL bağlantı bilgileri
const pool = new Pool({
  connectionString: "postgres://postgres:YZ1R8SvsWzYN4VjU99m9G66Ge2el828mCZydCYHAbeWKx51CzK3I683n1PrfsLm2@95.217.18.18:5432/postgres",
  ssl: false
});

async function checkDirectDatabase() {
  try {
    console.log('🔗 PostgreSQL veritabanına doğrudan bağlanıyor...');
    
    // Tabloları listele
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Mevcut Tablolar:');
    console.log('==================');
    tablesResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
    // Users tablosu var mı kontrol et
    const usersTableExists = tablesResult.rows.some(row => row.table_name === 'users');
    
    if (usersTableExists) {
      console.log('\n✅ "users" tablosu mevcut!');
      
      // Users tablosundan veri çek
      const usersResult = await pool.query('SELECT id, email, username, role, "firstName", "lastName", "isActive" FROM users ORDER BY "createdAt" DESC');
      
      console.log('\n👥 Users Tablosundaki Veriler:');
      console.log('==============================');
      if (usersResult.rows.length > 0) {
        usersResult.rows.forEach((user, index) => {
          console.log(`${index + 1}. ID: ${user.id}`);
          console.log(`   Email: ${user.email}`);
          console.log(`   Username: ${user.username}`);
          console.log(`   Role: ${user.role}`);
          console.log(`   Name: ${user.firstName} ${user.lastName}`);
          console.log(`   Active: ${user.isActive}`);
          console.log('   ---');
        });
      } else {
        console.log('❌ Users tablosu boş!');
      }
    } else {
      console.log('\n❌ "users" tablosu bulunamadı!');
    }
    
    // Prisma migration tablosunu kontrol et
    const migrationsResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = '_prisma_migrations';
    `);
    
    if (migrationsResult.rows.length > 0) {
      console.log('\n📊 Prisma migrasyonları mevcut');
      const migrations = await pool.query('SELECT migration_name, applied_steps_count FROM "_prisma_migrations" ORDER BY started_at DESC LIMIT 5');
      console.log('Son 5 migrasyon:');
      migrations.rows.forEach((migration, index) => {
        console.log(`${index + 1}. ${migration.migration_name} (${migration.applied_steps_count} adım)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Veritabanı hatası:', error.message);
  } finally {
    await pool.end();
  }
}

checkDirectDatabase();