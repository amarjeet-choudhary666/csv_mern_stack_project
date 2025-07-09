import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const connectionInstances = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'mernstack_project',
        })

        console.log(`MongoDB connected: ${connectionInstances.connection.host}`);
    } catch (error) {
        console.log("failed to connect to MongoDB", error);
        process.exit(1); 
    }
}