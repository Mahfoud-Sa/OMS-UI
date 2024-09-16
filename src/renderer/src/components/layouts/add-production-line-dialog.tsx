import { StructureTable } from '@renderer/components/tables/structure-table '
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface ProductionLineTeam {
  name: string
  phoneNumber: string
}

interface AddProductionLineDialogProps {
  onSave: (productionLine: { name: string; productionLines: ProductionLineTeam[] }) => void
}

const AddProductionLineDialog: React.FC<AddProductionLineDialogProps> = ({ onSave }) => {
  const [teams, setTeams] = useState<ProductionLineTeam[]>([])
  const [teamName, setTeamName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const { control, handleSubmit, reset } = useForm<{ name: string }>()

  const addTeam = () => {
    setTeams([...teams, { name: teamName, phoneNumber }])
    setTeamName('')
    setPhoneNumber('')
  }

  const onSubmit = (data: { name: string }) => {
    const newProductionLine = { name: data.name, productionLines: teams }
    onSave(newProductionLine)
    reset()
    setTeams([])
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'اسم الفريق',
      cell: (info: any) => info.getValue()
    },
    {
      accessorKey: 'phoneNumber',
      header: 'رقم الهاتف',
      cell: (info: any) => info.getValue()
    }
  ]

  return (
    <AlertDialog>
      <AlertDialogTrigger className="m-0 w-full rounded px-2 py-1.5 text-right text-blue-500 hover:bg-gray-100">
        إضافة خط انتاج
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="*:text-right">
          <AlertDialogTitle>إضافة خط انتاج</AlertDialogTitle>
          <hr />
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogDescription>
            <div className="flex flex-col gap-3">
              <div>
                <label>اسم خط الانتاج:</label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="اسم خط الانتاج" />}
                />
              </div>
              <div>
                <label>اسم الفريق:</label>
                <Input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="اسم الفريق"
                />
              </div>
              <div>
                <label>رقم الهاتف:</label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="رقم الهاتف"
                />
              </div>
              <Button type="button" onClick={addTeam}>
                إضافة فريق
              </Button>
              <StructureTable columns={columns} data={teams} title="الفرق المضافة" />
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="text-muted-foregrounds">إلغاء</AlertDialogCancel>
            <AlertDialogAction className="bg-green-600 text-white hover:bg-green-500" type="submit">
              حفظ
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AddProductionLineDialog
