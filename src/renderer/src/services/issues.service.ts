import { getApi, patchApi } from '@renderer/lib/http'

export enum IssueStatuses {
  OPEN = 'open',
  RESOLVED = 'resolved'
}

export interface Issue {
  id: number
  title: string
  billNo: string
  description: string
  status: IssueStatuses
  createdAt: string
  updatedAt: string
}

// Dummy data as fallback
const dummyIssues: Issue[] = [
  {
    id: 1,
    title: 'مشكلة في الفاتورة',
    billNo: 'BILL-001',
    description: 'هناك خطأ في مبلغ الفاتورة المدرج في النظام',
    status: IssueStatuses.OPEN,
    createdAt: '2023-09-15T10:30:00Z',
    updatedAt: '2023-09-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'تأخير في التسليم',
    billNo: 'BILL-002',
    description: 'لم يتم تسليم الطلب في الوقت المحدد',
    status: IssueStatuses.OPEN,
    createdAt: '2023-09-10T08:15:00Z',
    updatedAt: '2023-09-12T14:20:00Z'
  },
  {
    id: 3,
    title: 'منتج غير متوفر',
    billNo: 'BILL-003',
    description: 'المنتج المطلوب غير متوفر في المخزون',
    status: IssueStatuses.RESOLVED,
    createdAt: '2023-09-05T11:45:00Z',
    updatedAt: '2023-09-07T09:30:00Z'
  },
  {
    id: 4,
    title: 'خطأ في العنوان',
    billNo: 'BILL-004',
    description: 'تم تسجيل عنوان التسليم بشكل غير صحيح',
    status: IssueStatuses.OPEN,
    createdAt: '2023-09-14T13:20:00Z',
    updatedAt: '2023-09-14T13:20:00Z'
  },
  {
    id: 5,
    title: 'مشكلة في جودة المنتج',
    billNo: 'BILL-005',
    description: 'المنتج المستلم به عيوب في التصنيع',
    status: IssueStatuses.OPEN,
    createdAt: '2023-09-08T15:10:00Z',
    updatedAt: '2023-09-09T10:05:00Z'
  }
]

export const getIssues = async (): Promise<Issue[]> => {
  try {
    // Replace with actual API endpoint when available
    const response = await getApi<Issue[]>('/issues')
    return response.data
  } catch (error) {
    console.error('Error fetching issues:', error)
    return dummyIssues
  }
}

export const getIssueById = async (id: number): Promise<Issue | undefined> => {
  try {
    // Replace with actual API endpoint when available
    const response = await getApi<Issue>(`/issues/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching issue with id ${id}:`, error)
    return dummyIssues.find((issue) => issue.id === id)
  }
}

export async function updateIssueStatus(id: number, status: IssueStatuses): Promise<Issue> {
  try {
    const response = await patchApi<Issue>(`/issues/${id}`, {
      status
    })
    return response.data
  } catch (error) {
    console.error('Error updating issue status:', error)
    throw error
  }
}
