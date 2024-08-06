'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, TextField, AppBar, Toolbar, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity: existingQuantity } = docSnap.data()
      await setDoc(docRef, { quantity: existingQuantity + parseInt(quantity) })
    } else {
      await setDoc(docRef, { quantity: parseInt(quantity) })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box width="100vw" height="100vh" bgcolor="#f0e4d7" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
      <AppBar position="static" sx={{ width: '90%', maxWidth: '800px', mt: 4, p: 2, bgcolor: '#3949ab' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            id="outlined-basic"
            label="Item"
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ marginRight: 2, bgcolor: 'white', flexGrow: 1 }}
          />
          <TextField
            id="outlined-basic"
            label="Quantity"
            variant="outlined"
            type="number"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            sx={{ marginRight: 2, bgcolor: 'white', flexGrow: 1 }}
          />
          <IconButton
            color="inherit"
            onClick={() => {
              addItem(itemName, itemQuantity)
              setItemName('')
              setItemQuantity('')
            }}
          >
            <AddIcon sx={{ color: '#4caf50' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box border="none" mt={2} width="90%" maxWidth="800px" display="flex" flexDirection="column" alignItems="center">
        <Box
          width="100%"
          height="100px"
          bgcolor="#3949ab"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h2" color="#fff" textAlign="center">
            The Pantry
          </Typography>
        </Box>
        <Stack width="90%" spacing={2} overflow="auto" mt={2} p={2} mx="auto">
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#ffe0b2"
              padding={2}
              sx={{ ':hover': { backgroundColor: '#ffcc80' }, marginBottom: 2 }}
            >
              <Typography variant="h5" color="#333">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h5" color="#333">
                Quantity: {quantity}
              </Typography>
              <Box display="flex" gap={2}>
                <Button variant="contained" sx={{ backgroundColor: '#4caf50', color: 'white' }} onClick={() => addItem(name, 1)}>
                  <AddIcon />
                </Button>
                <Button variant="contained" sx={{ backgroundColor: '#f44336', color: 'white' }} onClick={() => removeItem(name)}>
                  <RemoveIcon />
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

