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
import { toast } from '@renderer/components/ui/use-toast'
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
  const [lineNameError, setLineNameError] = useState('')
  const [teamNameError, setTeamNameError] = useState('')
  const [teamPhoneError, setTeamPhoneError] = useState('')
  const [teamsError, setTeamsError] = useState('')
  const { id } = productionLine || {}
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (openDialog) {
      setIsDialogOpen(true)
    }
  }, [openDialog])

  useEffect(() => {
    if (isEdit && productionLine) {
      setLineName(productionLine.name)
      setTeams(productionLine.teams || [])
    }
  }, [isEdit, productionLine])

  const validatePhone = (phone: string) => {
    const phoneRegex = /^5\d{8}$/
    return phoneRegex.test(phone)
  }

  const addTeam = () => {
    let valid = true
    if (!lineName) {
      setLineNameError('اسم خط الانتاج مطلوب')
      valid = false
    } else {
      setLineNameError('')
    }
    if (!teamName) {
      console.log('s')
      setTeamNameError('اسم الفريق مطلوب')
      valid = false
    } else {
      setTeamNameError('')
    }

    if (!teamPhone) {
      setTeamPhoneError('رقم الهاتف مطلوب')
      valid = false
    } else if (!validatePhone(teamPhone)) {
      setTeamPhoneError('رقم الهاتف يجب أن يكون 9 أرقام تبدأ بـ 5')
      valid = false
    } else {
      setTeamPhoneError('')
    }

    if (valid) {
      setTeams([...teams, { name: teamName, phone: teamPhone, newTeam: true }])
      setTeamName('')
      setTeamPhone('')
      setLineNameError('')
      console.log(teams)
    }
  }

  const handleAddProductionLine = async () => {
    let valid = true
    if (!lineName) {
      setLineNameError('اسم خط الانتاج مطلوب')
      valid = false
    } else {
      setLineNameError('')
    }

    if (teams.length === 0) {
      setTeamsError('يجب إضافة فريق واحد على الأقل')
      valid = false
    } else {
      setTeamsError('')
    }

    if (valid) {
      try {
        setIsSubmitting(true)
        await addProductionLineWithTeams(lineName, teams)
        setLineName('')
        setTeams([])
      } catch (error) {
        console.error('Failed to add production line:', error)
        toast({
          title: 'خطأ',
          description: 'حدث خطأ أثناء إضافة خط الإنتاج',
          variant: 'destructive'
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleEditProductionLine = async () => {
    let valid = true
    if (!lineName) {
      setLineNameError('اسم خط الانتاج مطلوب')
      valid = false
    } else {
      setLineNameError('')
    }

    if (teams.length === 0) {
      setTeamsError('يجب إضافة فريق واحد على الأقل')
      valid = false
    } else {
      setTeamsError('')
    }

    if (valid && editProductionLineWithTeams && id) {
      try {
        setIsSubmitting(true)
        editProductionLineWithTeams(id, lineName, teams)
        setLineName('')
        setTeams([])
      } catch (error) {
        console.error('Failed to edit production line:', error)
        toast({
          title: 'خطأ',
          description: 'حدث خطأ أثناء تعديل خط الإنتاج',
          variant: 'destructive'
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleAddEditProductionLine = () => {
    if (isEdit && productionLine) {
      handleEditProductionLine()
    } else {
      handleAddProductionLine()
    }
  }

  const removeProductionTeam = (team: ProductionTeam) => {
    const newTeams = teams.filter((t) => t !== team)
    setTeams(newTeams)
  }

  const columns = [
    {
      header: 'اسم قائد الفريق',
      accessorKey: 'name',
      cell: (info) => info.row.original.name
    },
    {
      header: 'رقم التواصل',
      accessorKey: 'phone',
      cell: (info) => info.row.original.phone
    },
    {
      id: 'actions',
      cell: (info) => {
        const { original } = info.row
        return original && info.row.original.newTeam ? (
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
        <DialogHeader>{isEdit ? 'تحديث خط الانتاج' : 'انشاء خط انتاج'}</DialogHeader>
        <div>
          <Input
            value={lineName}
            onChange={(e) => setLineName(e.target.value)}
            placeholder="اسم خط الانتاج"
            label="اسم خط الانتاج"
          />
          {lineNameError && <small className="text-red-500">{lineNameError}</small>}
          <div className="mt-4">
            <label>فرق الإنتاج</label>
            <div className="flex justify-between gap-4 my-2">
              <div className="flex-1">
                <Input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="اسم قائد فريق الإنتاج"
                  label="اسم قائد فريق الإنتاج"
                />
                {teamNameError && <small className="text-red-500">{teamNameError}</small>}
              </div>
              <div className="flex-1">
                <Input
                  value={teamPhone}
                  onChange={(e) => setTeamPhone(e.target.value)}
                  placeholder="رقم التواصل"
                  label="رقم التواصل"
                  type="tel"
                  maxLength={9}
                  prefix="+966"
                />
                {teamPhoneError && <small className="text-red-500">{teamPhoneError}</small>}
              </div>
            </div>
            <Button type="button" onClick={addTeam}>
              إضافة فريق الإنتاج
            </Button>
          </div>
          {teamsError && <small className="text-red-500">{teamsError}</small>}
          <div className="mt-4">
            <StructureTable<ProductionTeam, unknown>
              columns={columns}
              data={teams}
              title="خطوط الانتاج المضافة"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleAddEditProductionLine} disabled={isSubmitting}>
            {isSubmitting ? 'جارٍ الإضافة...' : isEdit ? 'تحديث خط الإنتاج' : 'إضافة خط الإنتاج'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProductionLineDialog
