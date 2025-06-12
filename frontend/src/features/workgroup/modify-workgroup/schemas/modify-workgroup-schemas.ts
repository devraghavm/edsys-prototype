import { z } from 'zod';

export const orgChartSchema = z
  .object({
    nodes: z
      .array(
        z.object({
          id: z.string(),
          position: z.object({
            x: z.number(),
            y: z.number(),
          }),
          type: z.string().min(1).optional(),
          data: z.record(z.unknown()).optional(),
        })
      )
      .optional(),
    edges: z
      .array(
        z.object({
          source: z.string(),
          target: z.string(),
          id: z.string(),
        })
      )
      .optional(),
    nodeTypes: z.record(z.any()).optional(),
    minDistance: z.number().optional(),
    styles: z.record(z.string()).optional(),
    customCssClassnames: z.string().optional(),
  })
  .optional();

export const orgChartSummarySchema = z
  .array(
    z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      department: z.string().optional(),
      position: z.string().optional(),
      parentId: z.string().optional(),
    })
  )
  .optional();

// Step 1: Basic Info
export const workgroupStep1Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

// Step 2: Org Chart
export const workgroupStep2Schema = z.object({
  orgChart: orgChartSchema.optional(),
  orgChartSummary: orgChartSummarySchema.optional(),
});

// Step 3: Address Info
export const workgroupStep3Schema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
});

// Combine all steps for review
export const fullWorkgroupSchema = workgroupStep1Schema
  .merge(workgroupStep2Schema)
  .merge(workgroupStep3Schema);

export type Step1FormData = z.infer<typeof workgroupStep1Schema>;
export type Step2FormData = z.infer<typeof workgroupStep2Schema>;
export type Step3FormData = z.infer<typeof workgroupStep3Schema>;
export type WorkgroupFormData = z.infer<typeof fullWorkgroupSchema>;
