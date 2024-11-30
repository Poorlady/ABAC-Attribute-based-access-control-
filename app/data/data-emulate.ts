// Try to emulate bank organization
// there are 3 roles manager, banker, and auditor
// there are 3 dept which are finance, credit, and marketing
// there are 3 source of resource which are report, cheque, credit
// attribute file is clearence, geo, and is_manager
// manager on credit can view, reject, and accept loan
// banker on credit can create and view loan
// auditor on each dept can view the resources
// manager on finance can view, reject, accept cheque,
// banker on finance can accept, view, reject, and raise cheque
// manager in marketing can accept, reject, and view plan
// banker in marketing can view, create, plan

type Roles = 'manager' | 'banker' | 'auditor';
type Depts = 'finance' | 'credit' | 'marketing';
type Clearence = 'low' | 'medium' | 'high';
type Geo = 'branch' | 'head-office' | 'remote';
type AccStatus = 'active' | 'frozen' | 'closed';
type PermissionList = 'view' | 'reject' | 'accept' | 'raise' | 'create';
type AccType = 'checking' | 'loan';

type User = {
  id: number;
  name: string;
  is_manager: boolean;
  roles: Roles[];
  depts: Depts[];
  cleareance: Clearence;
  Location: Geo;
};

type ResourcesTransactions = {
  id: number;
  account_type: AccType;
  transaction_amount: number;
  account_holder: string;
  account_status: AccStatus;
  sensitivity: Clearence;
  dept: Depts;
};

type PlanMarketing = {
  id: number;
  title: string;
  content: string;
  budget: number;
};

type ResourceWithPermission = {
  planMarketing: {
    typeData: PlanMarketing;
    actions: PermissionList;
  };
  resourcesTransaction: {
    typeData: ResourcesTransactions;
    actions: PermissionList;
  };
};

type CheckinPermission<Key extends keyof ResourceWithPermission> =
  | boolean
  | ((user: User, data: ResourceWithPermission[Key]['typeData']) => boolean);

type RolesWithPermissions = {
  [Role in Roles]: Partial<{
    [Key in keyof ResourceWithPermission]: Partial<{
      [Actions in ResourceWithPermission[Key]['actions']]: CheckinPermission<Key>;
    }>;
  }>;
};

function checkUserDept<Key extends keyof ResourceWithPermission>(
  user: User,
  data: ResourceWithPermission[Key]['typeData'],
  dept: Depts
) {
  return user.depts.includes(dept);
}

function managerTransaction(
  user: User,
  data: ResourcesTransactions,
  transaction_amount: number,
  sensitivity: Clearence
) {
  if (
    data.transaction_amount > transaction_amount &&
    data.sensitivity !== sensitivity &&
    user.Location !== 'remote'
  )
    return true;
  else if (
    data.transaction_amount < transaction_amount &&
    data.sensitivity === sensitivity
  )
    return true;
  else return false;
}

const Roles = {
  auditor: {
    resourcesTransaction: {
      view: true,
    },
  },
  manager: {
    planMarketing: {
      view: (user, data) => checkUserDept(user, data, 'marketing'),
      accept: (user, data) => checkUserDept(user, data, 'marketing'),
      reject: (user, data) => checkUserDept(user, data, 'marketing'),
    },
    resourcesTransaction: {
      view: (user, data) => managerTransaction(user, data, 5000, 'low'),
      accept: (user, data) => managerTransaction(user, data, 5000, 'low'),
      reject: (user, data) => managerTransaction(user, data, 5000, 'low'),
      create: (user, data) =>
        data.account_type === 'loan' &&
        data.transaction_amount > 5000 &&
        user.depts.includes('credit'),
    },
  },
  banker: {
    planMarketing: {
      create: (user, data) => checkUserDept(user, data, 'marketing'),
      view: (user, data) => checkUserDept(user, data, 'marketing'),
    },
    resourcesTransaction: {
      view: (user, data) => data.sensitivity === 'low',
      raise: (user, data) =>
        data.account_type === 'checking' &&
        user.depts.includes('finance') &&
        user.depts.includes('credit') &&
        data.transaction_amount > 5000 &&
        user.Location !== 'remote',
      reject: (user, data) =>
        data.account_type === 'checking' &&
        user.Location !== 'remote' &&
        user.depts.includes('finance'),
      accept: (user, data) =>
        data.account_type === 'checking' &&
        data.transaction_amount < 5000 &&
        data.sensitivity === 'low' &&
        user.Location !== 'remote' &&
        user.depts.includes('finance'),
      create: (user, data) =>
        data.account_type === 'loan' &&
        data.account_status === 'active' &&
        data.transaction_amount < 5000 &&
        user.Location !== 'remote' &&
        user.depts.includes('credit'),
    },
  },
} as const satisfies RolesWithPermissions;
