import * as React from 'react';
import {
  Activity,
  BriefcaseBusiness,
  LifeBuoy,
  Send,
  Shield,
  User,
  Users,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavAdmin } from '@/components/nav-admin';
import { useAuth } from '@/auth/AuthProvider';

const data = {
  user: {
    name: 'Raghav Medapati',
    email: 'raghav.medapati@state.co.us',
    avatar: '/avatars/shadcn.jpg',
  },
  navAdmin: [
    {
      title: 'Management',
      url: '#',
      icon: Shield,
      isActive: true,
      items: [
        {
          title: 'Manage Users',
          url: '/users',
        },
        {
          title: 'Add User',
          url: '/users/add',
        },
        {
          title: 'Manage Roles',
          url: '#',
        },
        {
          title: 'Add Role',
          url: '#',
        },
      ],
    },
  ],
  navMain: [
    {
      title: 'Workgroup',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Create Workgroup',
          url: '/workgroup/create',
        },
        {
          title: 'Delete Workgroup',
          url: '#',
        },
        {
          title: 'Modify Workgroup',
          url: '/workgroup/modify/:id',
        },
        {
          title: 'Move Workgroup',
          url: '#',
        },
      ],
    },
    {
      title: 'Position',
      url: '#',
      icon: BriefcaseBusiness,
      items: [
        {
          title: 'Create Position',
          url: '#',
        },
        {
          title: 'Transfer Position',
          url: '#',
        },
        {
          title: 'Abolish Position',
          url: '#',
        },
        {
          title: 'Fill Position',
          url: '#',
        },
        {
          title: 'Changing Position',
          url: '#',
        },
      ],
    },
    {
      title: 'Activity',
      url: '#',
      icon: Activity,
      items: [
        {
          title: 'Activity Log',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userPrincipalName } = useAuth();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <button
                type="button"
                className="flex w-full items-center bg-transparent border-none p-0 text-inherit"
                style={{ background: 'none', border: 'none' }}
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <User className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">CDLE</span>
                  <span className="truncate text-xs">State of Colorado</span>
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavAdmin items={data.navAdmin} />
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={
            userPrincipalName
              ? { ...data.user, name: userPrincipalName }
              : data.user
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
