import { Icons } from '@renderer/components/icons/icons'
import { StructureTable } from '@renderer/components/tables/structure-table '
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { Input } from '@renderer/components/ui/input'
import { ProductionLineProps, ProductionTeam } from '@renderer/types/api'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../../../ui/dialog'

const ProductionLineDialog = ({
  addProductionLineWithTeams,
  editProductionLineWithTeams,
  onClose,
  productionLine,
  isEdit = false,
  openDialog = false
}: {
  addProductionLineWithTeams: (name: string, teams: ProductionTeam[]) => void
  editProductionLineWithTeams?: (id: string, name: string, teams: ProductionTeam[]) => void
  onClose?: () => void
  productionLine?: ProductionLineProps
  isEdit?: boolean
  openDialog?: boolean
}) => {
  const [lineName, setLineName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [teamPhone, setTeamPhone] = useState('')
  const [teams, setTeams] = useState<ProductionTeam[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(openDialog)
  const { id } = productionLine || {}

  useEffect(() => {
    if (openDialog) {
      setIsDialogOpen(true)
    }
  }, [openDialog])

  useEffect(() => {
    if (isEdit && productionLine) {
      setLineName(productionLine.name)
      setTeams(productionLine.productionTeams || [])
    }
  }, [isEdit, productionLine])

  const addTeam = () => {
    setTeams([...teams, { name: teamName, phone: teamPhone }])
    setTeamName('')
    setTeamPhone('')
  }

  const handleAddProductionLine = () => {
    addProductionLineWithTeams(lineName, teams)
    setLineName('')
    setTeams([])
  }

  const handleEditProductionLine = () => {
    console.log('editProductionLineWithTeams', lineName, teams)
    if (editProductionLineWithTeams && id) {
      editProductionLineWithTeams(id, lineName, teams)
    }
    setLineName('')
    setTeams([])
  }

  const handleAddEditProductionLine = () => {
    if (isEdit && productionLine) {
      handleEditProductionLine()
    } else {
      handleAddProductionLine()
    }
    setLineName('')
    setTeams([])
  }

  const removeProductionTeam = (team: ProductionTeam) => {
    const newTeams = teams.filter((t) => t !== team)
    setTeams(newTeams)
  }

  const columns = [
    {
      header: 'اسم الفريق',
      accessorKey: 'name',
      cell: (info) => info.row.original.name
    },
    {
      header: 'رقم الهاتف',
      accessorKey: 'phone',
      cell: (info) => info.row.original.phone
    },
    {
      id: 'actions',
      cell: (info) => {
        const { original } = info.row
        return original ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Icons.ellipsis className="object-contain shrink-0 w-6 aspect-square" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => removeProductionTeam(info.row.original)}
                  style={{ backgroundColor: 'orange', color: 'white' }}
                  color="white"
                  className="btn"
                >
                  {'حذف'}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null
      }
    }
  ]

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => {
        setIsDialogOpen(false)
        onClose && onClose()
        setLineName('')
        setTeams([])
      }}
    >
      <Button type="button" onClick={() => setIsDialogOpen(true)}>
        إضافة خط انتاج
      </Button>
      <DialogContent>
        <DialogHeader>إنشاء خطوط الإنتاج</DialogHeader>
        <div>
          <Input
            value={lineName}
            onChange={(e) => setLineName(e.target.value)}
            placeholder="اسم خط الانتاج"
            label="اسم خط الانتاج"
          />
          <div className="mt-4">
            <label>فرق الإنتاج</label>
            <Input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="اسم فريق الإنتاج"
              label="اسم فريق الإنتاج"
            />
            <Input
              value={teamPhone}
              onChange={(e) => setTeamPhone(e.target.value)}
              placeholder="رقم هاتف فريق الإنتاج"
              label="رقم هاتف فريق الإنتاج"
            />
            <Button type="button" onClick={addTeam}>
              إضافة فريق الإنتاج
            </Button>
          </div>
          <div className="mt-4">
            <StructureTable<ProductionTeam, unknown>
              columns={columns}
              data={teams}
              title="خطوط الانتاج المضافة"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddEditProductionLine}>
            إضافة خط الإنتاج
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProductionLineDialog
