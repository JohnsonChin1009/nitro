"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pizza, Shirt } from "lucide-react"

export default function InventoryTab({petState, setPetState, setPetImage}: any) {
  const [equippedAccessory, setEquippedAccessory] = useState("bow-tie")
  const [foodItemsState, setFoodItemsState] = useState([
    { id: "tuna", name: "Tuna Treat", happiness: 5, quantity: 3, icon: "🐟" },
    { id: "milk", name: "Fresh Milk", happiness: 3, quantity: 5, icon: "🥛" },
    { id: "chicken", name: "Chicken Bits", happiness: 7, quantity: 2, icon: "🍗" },
    { id: "treats", name: "Gourmet Treats", happiness: 10, quantity: 1, icon: "🍪" },
  ])

  const accessories = [
    { id: "bow-tie", name: "Bow Tie", effect: "Professional Look", equipped: true, icon: "🎀", image:`/petcat.png?height=180&width=180` },
    { id: "hat", name: "Top Hat", effect: "+5% Reputation Gain", equipped: false, icon: "🎩", image: `/petwithhat.png?height=180&width=180` },
    { id: "glasses", name: "Smart Glasses", effect: "+10% Loan Approval", equipped: false, icon: "👓" },
    { id: "scarf", name: "Cozy Scarf", effect: "+3% Interest Reduction", equipped: false, icon: "🧣" },
  ]

  const useFood = useCallback((food: any) => {
    setPetState((prev: any) => ({
        ...prev,
        happiness: Math.min(prev.happiness + food.happiness, 100) // Optional cap at 100
      }))
    setFoodItemsState((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === food.id) {
          return { ...item, quantity: item.quantity - 1 }
        }
        return item
      })
    })
  }, [])

  const equipAccessory = (accessory: any) => {
    setPetImage(accessory.image)
    setEquippedAccessory(accessory.id)
  }

  return (
    <Tabs defaultValue="food" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="food">
          <Pizza className="h-4 w-4 mr-2" /> Food Items
        </TabsTrigger>
        <TabsTrigger value="accessories">
          <Shirt className="h-4 w-4 mr-2" /> Accessories
        </TabsTrigger>
      </TabsList>

      <TabsContent value="food">
        <Card>
          <CardHeader>
            <CardTitle>Food Inventory</CardTitle>
            <CardDescription>Feed your pet to increase happiness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Current Happiness</span>
                <span className="font-bold">{petState.happiness}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${petState.happiness}%` }}></div>
              </div>
            </div>

            <ul className="space-y-3">
              {foodItemsState.map((food) => (
                <li key={food.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{food.icon}</span>
                    <div>
                      <p className="font-medium">{food.name}</p>
                      <p className="text-sm text-gray-500">+{food.happiness} Happiness</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-3">
                      x{food.quantity}
                    </Badge>
                    <Button size="sm" onClick={() => useFood(food)} disabled={food.quantity <= 0}>
                      Feed
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="accessories">
        <Card>
          <CardHeader>
            <CardTitle>Accessories</CardTitle>
            <CardDescription>Equip items to change your pet's appearance and stats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Currently Equipped</span>
                <span className="font-bold">{accessories.find((a) => a.id === equippedAccessory)?.name || "None"}</span>
              </div>
            </div>

            <ul className="space-y-3">
              {accessories.map((accessory) => (
                <li key={accessory.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{accessory.icon}</span>
                    <div>
                      <p className="font-medium">{accessory.name}</p>
                      <p className="text-sm text-gray-500">{accessory.effect}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={accessory.id === equippedAccessory ? "default" : "outline"}
                    onClick={() => equipAccessory(accessory)}
                  >
                    {accessory.id === equippedAccessory ? "Equipped" : "Equip"}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
