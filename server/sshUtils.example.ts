// This is an EXAMPLE of how you might implement the backend API
// to get all IPs from a server using SSH
// You would need to install: npm install node-ssh

import { NodeSSH } from 'node-ssh';
import express, { Request, Response } from 'express';

const router = express.Router();

interface ServerIPRequest {
  serverIP: string;
  sshUser: string;
  sshPort: string;
  sshPassword: string;
  sshAuthType: 'Password' | 'Key';
}

interface NetworkInterface {
  name: string;
  publicIP: string;
  privateIP: string;
  ipVersion: string;
  ptr: string;
  vmtaTagNumber: string;
  domainAssociated: string;
}

// API endpoint to get all IPs from a server via SSH
router.post('/api/server/get-ips', async (req: Request, res: Response) => {
  const { serverIP, sshUser, sshPort, sshPassword, sshAuthType } = req.body as ServerIPRequest;
  
  if (!serverIP || !sshUser) {
    return res.status(400).json({ 
      error: 'Server IP and SSH user are required' 
    });
  }
  
  try {
    // Create SSH connection
    const ssh = new NodeSSH();
    
    // Connect to the server
    await ssh.connect({
      host: serverIP,
      username: sshUser,
      port: parseInt(sshPort || '22'),
      password: sshAuthType === 'Password' ? sshPassword : undefined,
      // If using key-based authentication, you would include:
      // privateKey: '/path/to/private/key' or privateKeyString
    });
    
    // Execute 'ip addr' command to get all network interfaces
    const { stdout } = await ssh.execCommand('ip addr');
    
    // Parse the output to extract IPs
    const serverIPs = parseIpAddrOutput(stdout);
    
    // Close the SSH connection
    ssh.dispose();
    
    // Return the list of IPs
    return res.json(serverIPs);
  } catch (error: any) {
    console.error('Error getting server IPs:', error);
    return res.status(500).json({ 
      error: 'Failed to get IPs from server', 
      message: error.message 
    });
  }
});

// Function to parse 'ip addr' command output and extract IPs
function parseIpAddrOutput(output: string): NetworkInterface[] {
  const interfaces: NetworkInterface[] = [];
  const lines = output.split('\n');
  
  let currentInterface: Partial<NetworkInterface> = {};
  let inInterface = false;
  
  // Parse each line of the output
  for (const line of lines) {
    // New interface definition starts with a number
    if (line.match(/^\d+:/)) {
      if (inInterface && currentInterface.publicIP) {
        interfaces.push(currentInterface as NetworkInterface);
      }
      
      inInterface = true;
      currentInterface = {
        name: line.match(/^\d+:\s+([^:]+):/)?.[1] || '',
        publicIP: '',
        privateIP: '',
        ipVersion: '',
        ptr: '',
        vmtaTagNumber: '',
        domainAssociated: ''
      };
    }
    
    // Look for IPv4 addresses
    if (inInterface && line.includes('inet ')) {
      const ipMatch = line.match(/inet\s+([0-9.]+)/);
      if (ipMatch && ipMatch[1]) {
        const ip = ipMatch[1];
        
        // Determine if public or private IP
        if (
          ip.startsWith('10.') || 
          ip.startsWith('172.16.') || 
          ip.startsWith('192.168.') || 
          ip === '127.0.0.1'
        ) {
          currentInterface.privateIP = ip;
          currentInterface.ipVersion = 'IPv4';
        } else {
          currentInterface.publicIP = ip;
          currentInterface.ipVersion = 'IPv4';
        }
      }
    }
    
    // Look for IPv6 addresses
    if (inInterface && line.includes('inet6 ')) {
      const ipMatch = line.match(/inet6\s+([0-9a-f:]+)/);
      if (ipMatch && ipMatch[1] && !currentInterface.publicIP) {
        currentInterface.publicIP = ipMatch[1];
        currentInterface.ipVersion = 'IPv6';
      }
    }
  }
  
  // Add the last interface if it has an IP
  if (inInterface && currentInterface.publicIP) {
    interfaces.push(currentInterface as NetworkInterface);
  }
  
  // Try to get PTR records (this would require a separate DNS lookup)
  // This is simplified for the example
  return interfaces.map((iface, index) => ({
    ...iface,
    ptr: `${iface.name}.example.com`,
    vmtaTagNumber: `${100 + index}`,
    domainAssociated: 'example.com'
  }));
}

export default router;