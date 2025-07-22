import { useEffect, useState } from "react";
import { ArrowLeft, CircleMinus, CircleX, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AudienceData, audienceSchema } from "@/schemas/audience";
import { AdAccount, getAdAccounts } from "@/services/adAccountService";
import { toast } from "sonner";
import { createAudience } from "@/services/audience";
import { MultiValueInput } from "@/components/ui/multi-value-input";
import StatusDialog from "@/components/shared/StatusDialog";
import { useDialog } from "@/hooks/useDialog";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { get } from "http";
import getPixels, { TPixel } from "@/services/getPixels";

type AudienceType = "initial" | "website-visitors" | "lookalike";

interface CreateAudienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleSuccessfullState: (state: boolean) => void;
}

// interface AudienceFormData {
//   name: string;
//   source: string;
//   days?: number;
//   sourceAudience?: string;
// }

type TEventType = "all-visitors" | "pages-visitors" | "time-visitors";
type TOperator = "and" | "or";

const CreateAudienceDialog = ({
  open,
  onOpenChange,
  handleSuccessfullState,
}: CreateAudienceDialogProps) => {
  const [currentView, setCurrentView] = useState<AudienceType>("initial");
  const [eventTypes, setEventTypes] = useState<Record<number, TEventType>>({});
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState<string>("");
  const [pixels, setPixels] = useState<TPixel[]>([]);
  // const [formData, setFormData] = useState<AudienceFormData>({
  //   name: '',
  //   source: '',
  //   days: 60,
  //   sourceAudience: ''
  // });
  const [operatorValue, setOperatorValue] = useState<TOperator>("and");
  const [showFilters, setShowFilters] = useState(false);

  const form = useForm<AudienceData>({
    resolver: zodResolver(audienceSchema),
    defaultValues: {
      account_id: "",
      customaudience_data: {
        name: "",
        rule: {
          inclusions: {
            operator: "and",
            rules: [
              {
                event_sources: [
                  {
                    id: "",
                    type: "pixel",
                  },
                ],
                retention_seconds: "",
                filter: {
                  operator: "",
                  filters: [
                    {
                      field: "",
                      operator: "",
                      value: [],
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  });

  const {
    fields: includeFields,
    append: appendInclude,
    remove: removeInclude,
  } = useFieldArray({
    control: form.control,
    name: "customaudience_data.rule.inclusions.rules",
  });

  const {
    fields: excludeFields,
    append: appendExclude,
    remove: removeExclude,
  } = useFieldArray({
    control: form.control,
    name: "customaudience_data.rule.exclusions.rules",
  });

  const allFields = includeFields?.length + excludeFields?.length;

  const handleAddRule = () => {
    if (allFields < 5) {
      appendInclude({
        event_sources: [
          {
            id: "",
            type: "pixel",
          },
        ],
        filter: {
          operator: "and",
          filters: [
            {
              field: "",
              operator: "",
              value: [],
            },
          ],
        },
      });
    }
  };

  const handleAddExcludeRule = () => {
    if (allFields < 5) {
      appendExclude({
        event_sources: [
          {
            id: "",
            type: "pixel",
          },
        ],
        filter: {
          operator: "and",
          filters: [
            {
              field: "",
              operator: "",
              value: [],
            },
          ],
        },
      });
    }
  };

  const handleRemoveIncludeRule = (index: number) => {
    removeInclude(index);
  };

  const handleRemoveExcludeRule = (index: number) => {
    removeExclude(index);
  };

  const { isDialogOpen, dialogState, showDialog, handleDialogClose } =
    useDialog();

  const handleBack = () => {
    setCurrentView("initial");
    if (includeFields && includeFields.length > 1 && removeInclude) {
      for (let i = includeFields.length - 1; i > 0; i--) {
        removeInclude(i);
      }
    }
    if (excludeFields && excludeFields.length > 0 && removeExclude) {
      for (let i = excludeFields.length - 1; i >= 0; i--) {
        removeExclude(i);
      }
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSelectAudienceType = (type: AudienceType) => {
    setCurrentView(type);
  };

  // const handleInputChange = (field: keyof AudienceFormData, value: string | number) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     [field]: value
  //   }));
  // };

  // const handleCreateAudience = () => {
  //   let newAudience;

  //   if (currentView === 'lookalike' && formData.sourceAudience) {
  //     // Find the source audience
  //     const sourceAudience = audiencesData.find(aud => aud.id === formData.sourceAudience);

  //     if (sourceAudience) {
  //       newAudience = {
  //         id: `aud-${audiencesData.length + 1}`,
  //         name: `${sourceAudience.name} - Lookalike`,
  //         type: 'Lookalike',
  //         source: sourceAudience.source,
  //         size: '1000', // Default size for lookalike audiences
  //         status: 'Active'
  //       };
  //     }
  //   } else {
  //     newAudience = {
  //       id: `aud-${audiencesData.length + 1}`,
  //       name: formData.name,
  //       type: 'Website Visitors',
  //       source: formData.source,
  //       size: '0',
  //       status: 'Active'
  //     };
  //   }

  //   if (newAudience) {
  //     // Add the new audience to the data using the exported function
  //     addNewAudience(newAudience);
  //     navigate('/audiences');
  //     // Close the dialog and reset form
  //     handleClose();
  //   }
  // };

  const renderInitialView = () => (
    <>
      <DialogHeader className="bg-brand-blue text-white px-4 py-4 flex flex-row items-center justify-between">
        <DialogTitle className="text-xl">Create audience</DialogTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-brand-blue/80"
          onClick={handleClose}
        >
          <X size={18} />
        </Button>
      </DialogHeader>

      <div className="px-4 py-6 space-y-4">
        {/* Website Visitors Option */}
        <div
          onClick={() => handleSelectAudienceType("website-visitors")}
          className="border rounded-md p-4 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg mb-1">Website visitors</h3>
            {/* <div className="flex gap-1">
              <img
                src="/lovable-uploads/d5f033f6-b183-4516-9513-cf2d1e501443.png"
                alt="Meta"
                className="w-6 h-6"
              />
              <img
                src="/lovable-uploads/cd26779e-65cb-474b-a2d2-3c5674a5638c.png"
                alt="LinkedIn"
                className="w-6 h-6"
              />
              <img
                src="/lovable-uploads/cd26779e-65cb-474b-a2d2-3c5674a5638c.png"
                alt="Google"
                className="w-6 h-6"
              />
            </div> */}
          </div>
          <p className="text-gray-600">
            Nurture the people who've been to your site. Create an audience from
            your visitors and re-engage with them wherever they are online.
          </p>
        </div>

        {/* Lookalike Option */}
        {/* <div 
          onClick={() => handleSelectAudienceType('lookalike')}
          className="border rounded-md p-4 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg mb-1">Lookalike</h3>
            <div>
              <img src="/lovable-uploads/d5f033f6-b183-4516-9513-cf2d1e501443.png" alt="Meta" className="w-6 h-6" />
            </div>
          </div>
          <p className="text-gray-600">
            Create a lookalike audience based on your ideal customer and expand your reach to people who are more likely to convert.
          </p>
        </div> */}
      </div>
    </>
  );

  useEffect(() => {
    const fetchAdAccounts = async () => {
      try {
        const response = await getAdAccounts();
        setAdAccounts(response.data);
      } catch (error) {
        console.error("Error fetching ad accounts:", error);
        toast.error("Error fetching ad accounts");
      }
    };
    if (open) {
      fetchAdAccounts();
    }
  }, [open]);

  useEffect(() => {
    if (selectedAdAccount) {
      getPixels({ account_id: selectedAdAccount }).then((pixels) => {
        setPixels(pixels);
      });
    }
  }, [selectedAdAccount]);

  const onSubmit = async (data: AudienceData) => {
    // Convert retention_days to seconds if present in the data
    // Combine: map retention_seconds and clean empty filters in one pass, without mutating input
    let cleanedData = { ...data };
    if (cleanedData.customaudience_data?.rule?.inclusions?.rules) {
      cleanedData = {
        ...cleanedData,
        customaudience_data: {
          ...cleanedData.customaudience_data,
          rule: {
            ...cleanedData.customaudience_data.rule,
            inclusions: {
              ...cleanedData.customaudience_data.rule.inclusions,
              rules: cleanedData.customaudience_data.rule.inclusions.rules.map(
                (rule) => {
                  // Convert retention_seconds and clean filters in one go
                  let newRule = {
                    ...rule,
                    retention_seconds:
                      Number(rule.retention_seconds) * 24 * 60 * 60,
                  };
                  if (rule.filter && Array.isArray(rule.filter.filters)) {
                    const cleanedFilters = rule.filter.filters.filter(
                      (f) => Object.keys(f).length > 0
                    );
                    newRule = {
                      ...newRule,
                      filter: {
                        ...rule.filter,
                        filters: cleanedFilters,
                      },
                    };
                  }
                  return newRule;
                }
              ),
            },
          },
        },
      };
    }

    if (cleanedData.customaudience_data?.rule?.exclusions?.rules.length === 0) {
      delete cleanedData.customaudience_data.rule.exclusions;
    }

    if (cleanedData.customaudience_data?.rule?.exclusions?.rules.length > 0) {
      cleanedData.customaudience_data.rule.exclusions.operator = "or";
    }

    const res = await createAudience(cleanedData);
    if (res.id) {
      handleSuccessfullState(true);
      handleClose();
    } else {
      showDialog(
        "error",
        "Ooops",
        "Failed to create audience, please try again later.",
        false
      );
    }
  };

  const renderWebsiteVisitorsView = () => (
    <section className="h-[741px]">
      <StatusDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        title={dialogState.title}
        description={dialogState.description}
        variant={dialogState.variant}
        showActionButton={dialogState.showActionButton}
      />
      <DialogHeader className="bg-brand-blue text-white p-4 flex flex-row items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 text-white hover:bg-brand-blue/80"
          onClick={handleBack}
        >
          <ArrowLeft size={18} />
        </Button>
        <DialogTitle className="text-xl">
          Create website traffic audience
        </DialogTitle>
      </DialogHeader>

      <div className="p-6 pt-4 space-y-6">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="account_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-md">
                    Select Ad Account
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedAdAccount(value);
                    }}
                    value={selectedAdAccount}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Ad Account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {adAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customaudience_data.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-md">
                    Audience name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter an audience name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 items-center">
              <span>Include who meet</span>
              <FormField
                control={form.control}
                name="customaudience_data.rule.inclusions.operator"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={(value: TOperator) => {
                        field.onChange(value);
                        setOperatorValue(value);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[80px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="and">ALL</SelectItem>
                        <SelectItem value="or">ANY</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span>of the following criteria:</span>
            </div>
            

            {includeFields.map((field, index) => (
              <section
                key={field.id}
                className="border border-1 px-4 py-2 rounded-lg relative"
              >
                {includeFields?.length > 1 && (
                  <CircleX
                    size={16}
                    className="absolute top-3 right-4 text-red-500 cursor-pointer"
                    onClick={() => handleRemoveIncludeRule(index)}
                  />
                )}
                {index > 0 && (
                  <h2 className="font-bold mb-4 text-md">
                    {operatorValue === "and" ? "And" : "Or"}
                  </h2>
                )}
                <FormField
                  control={form.control}
                  name={`customaudience_data.rule.inclusions.rules.${index}.event_sources.${0}.id`}
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel className="font-medium text-md">
                        Source
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pixels.map((pixel) => (
                            <SelectItem key={pixel.id} value={pixel.id}>
                              {pixel.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="font-medium text-md">Events</label>
                  <Select
                    onValueChange={(value: TEventType) => {
                      setEventTypes((prev) => ({
                        ...prev,
                        [index]: value,
                      }));
                      form.setValue(
                        `customaudience_data.rule.inclusions.rules.${index}.filter.filters`,
                        [
                          {
                            field: "",
                            operator: "",
                            value: [],
                          },
                        ]
                      );
                    }}
                    defaultValue={eventTypes[index]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-visitors">
                        All website visitors
                      </SelectItem>
                      <SelectItem value="pages-visitors">
                        People who visited specific web pages
                      </SelectItem>
                      <SelectItem value="time-visitors">
                        Visitors by time spent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FormField
                  control={form.control}
                  name={`customaudience_data.rule.inclusions.rules.${index}.retention_seconds`}
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <div className="flex gap-2 items-center">
                        <FormLabel className="font-medium text-md">
                          Audience retention
                        </FormLabel>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info size={16} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <FormDescription>
                              Enter Number between 1 and 180
                            </FormDescription>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex gap-4 items-center">
                        <FormControl>
                          <Input
                            placeholder="Number of days"
                            className="w-1/2"
                            type="number"
                            min={1}
                            max={180}
                            {...field}
                            onChange={(e) => {
                              let value = Number(e.target.value);
                              if (value > 180) value = 180;
                              if (value < 1) value = 1;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <p className="font-medium">Days</p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {eventTypes[index] === "time-visitors" && (
                  <FormField
                    control={form.control}
                    name={`customaudience_data.rule.inclusions.rules.${index}.filter.filters.${
                      index + 1
                    }.value`}
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel className="font-medium text-md">
                          Percentile
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange([value]);
                            form.setValue(
                              `customaudience_data.rule.inclusions.rules.${index}.filter.filters.${
                                index + 1
                              }.field`,
                              ""
                            );
                            form.setValue(
                              `customaudience_data.rule.inclusions.rules.${index}.filter.filters.${
                                index + 1
                              }.operator`,
                              ""
                            );
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="select an percentage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="25">25%</SelectItem>
                            <SelectItem value="10">10%</SelectItem>
                            <SelectItem value="5">5%</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                )}

                {eventTypes[index] === "time-visitors" && (
                  <p
                    onClick={() => setShowFilters(true)}
                    className="text-[#1890ff] mt-2 text-sm cursor-pointer hover:underline decoration-1"
                  >
                    + Select specific web page(s)
                  </p>
                )}

                {(eventTypes[index] === "pages-visitors" || showFilters) && (
                  <section className="bg-[#f5f6f7] p-4 mt-2 rounded-lg">
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name={`customaudience_data.rule.inclusions.rules.${index}.filter.filters.${index}.field`}
                        render={({ field }) => (
                          <FormItem className="w-3/5">
                            <Select
                              onValueChange={field.onChange}
                              value="url"
                              disabled
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="url">URL</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`customaudience_data.rule.inclusions.rules.${index}.filter.filters.${index}.operator`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                form.setValue(
                                  `customaudience_data.rule.inclusions.rules.${index}.filter.filters.${index}.field`,
                                  "url"
                                );
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="select an operator" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="i_contains">
                                  contains
                                </SelectItem>
                                <SelectItem value="i_not_contains">
                                  doesn't contain
                                </SelectItem>
                                <SelectItem value="i_equals">equals</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name={`customaudience_data.rule.inclusions.rules.${index}.filter.filters.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <MultiValueInput
                                value={field.value || []}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                placeholder="Type a value and press Enter"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>
                )}
              </section>
            ))}

            {allFields < 5 && (
              <div className="flex gap-4 items-center mt-4">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleAddRule}
                >
                  {operatorValue === "and"
                    ? "Narrow further"
                    : "Include more people"}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleAddExcludeRule}
                >
                  Exclude people
                </Button>
              </div>
            )}

            {excludeFields.length > 0 && (
              <p className="flex items-center gap-2">
                <CircleMinus size={16} />
                Exclude people who meet any of the following criteria:
                </p>
            )}

            {excludeFields.map((field, index) => (
              <section
                key={field.id}
                className="border border-1 px-4 py-2 rounded-lg relative"
              >
                {allFields > 1 && (
                  <CircleX
                    size={16}
                    className="absolute top-3 right-4 text-red-500 cursor-pointer"
                    onClick={() => handleRemoveExcludeRule(index)}
                  />
                )}
                {index > 0 && <h2 className="font-bold mb-4 text-md">Or</h2>}
                <FormField
                  control={form.control}
                  name={`customaudience_data.rule.exclusions.rules.${index}.event_sources.${0}.id`}
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel className="font-medium text-md">
                        Source
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pixels.map((pixel) => (
                            <SelectItem key={pixel.id} value={pixel.id}>
                              {pixel.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="font-medium text-md">Events</label>
                  <Select
                    onValueChange={(value: TEventType) => {
                      setEventTypes((prev) => ({
                        ...prev,
                        [index]: value,
                      }));
                      form.setValue(
                        `customaudience_data.rule.exclusions.rules.${index}.filter.filters`,
                        [
                          {
                            field: "",
                            operator: "",
                            value: [],
                          },
                        ]
                      );
                    }}
                    defaultValue={eventTypes[index]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-visitors">
                        All website visitors
                      </SelectItem>
                      <SelectItem value="pages-visitors">
                        People who visited specific web pages
                      </SelectItem>
                      <SelectItem value="time-visitors">
                        Visitors by time spent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FormField
                  control={form.control}
                  name={`customaudience_data.rule.exclusions.rules.${index}.retention_seconds`}
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <div className="flex gap-2 items-center">
                        <FormLabel className="font-medium text-md">
                          Audience retention
                        </FormLabel>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info size={16} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <FormDescription>
                              Enter Number between 1 and 180
                            </FormDescription>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex gap-4 items-center">
                        <FormControl>
                          <Input
                            placeholder="Number of days"
                            className="w-1/2"
                            type="number"
                            min={1}
                            max={180}
                            {...field}
                            onChange={(e) => {
                              let value = Number(e.target.value);
                              if (value > 180) value = 180;
                              if (value < 1) value = 1;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <p className="font-medium">Days</p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {eventTypes[index] === "time-visitors" && (
                  <FormField
                    control={form.control}
                    name={`customaudience_data.rule.exclusions.rules.${index}.filter.filters.${
                      index + 1
                    }.value`}
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormLabel className="font-medium text-md">
                          Percentile
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange([value]);
                            form.setValue(
                              `customaudience_data.rule.exclusions.rules.${index}.filter.filters.${
                                index + 1
                              }.field`,
                              ""
                            );
                            form.setValue(
                              `customaudience_data.rule.exclusions.rules.${index}.filter.filters.${
                                index + 1
                              }.operator`,
                              ""
                            );
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="select an percentage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="25">25%</SelectItem>
                            <SelectItem value="10">10%</SelectItem>
                            <SelectItem value="5">5%</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                )}

                {eventTypes[index] === "time-visitors" && (
                  <p
                    onClick={() => setShowFilters(true)}
                    className="text-[#1890ff] mt-2 text-sm cursor-pointer hover:underline decoration-1"
                  >
                    + Select specific web page(s)
                  </p>
                )}

                {(eventTypes[index] === "pages-visitors" || showFilters) && (
                  <section className="bg-[#f5f6f7] p-4 mt-2 rounded-lg">
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name={`customaudience_data.rule.exclusions.rules.${index}.filter.filters.${index}.field`}
                        render={({ field }) => (
                          <FormItem className="w-3/5">
                            <Select
                              onValueChange={field.onChange}
                              value="url"
                              disabled
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="url">URL</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`customaudience_data.rule.exclusions.rules.${index}.filter.filters.${index}.operator`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                form.setValue(
                                  `customaudience_data.rule.exclusions.rules.${index}.filter.filters.${index}.field`,
                                  "url"
                                );
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="select an operator" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="i_contains">
                                  contains
                                </SelectItem>
                                <SelectItem value="i_not_contains">
                                  doesn't contain
                                </SelectItem>
                                <SelectItem value="i_equals">equals</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name={`customaudience_data.rule.exclusions.rules.${index}.filter.filters.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <MultiValueInput
                                value={field.value || []}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                placeholder="Type a value and press Enter"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>
                )}
              </section>
            ))}

            {allFields < 5 && excludeFields.length > 0 && (
              <Button
                  variant="secondary"
                  type="button"
                  onClick={handleAddExcludeRule}
                >
                  Exclude people
                </Button>
            )}

            <div className="flex justify-between !mt-8">
              <Button onClick={handleBack} variant="outline">
                Cancel
              </Button>
              {/* <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  console.log("Form errors:", form.formState.errors);
                  console.log("from data: ", form.getValues());
                  toast.error("Check the console for form errors.");
                }}
              >
                Log Form Errors
              </Button> */}
              <Button
                type="submit"
                className="bg-[#ff7a59] hover:bg-[#ff7a59]/90 text-white"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                {form.formState.isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                    Creating...
                  </>
                ) : (
                  "Create audience"
                )}
              </Button>
            </div>
          </form>
        </Form>
        {/* <div className="space-y-2">
          <label className="font-medium">Source</label>
          <Select onValueChange={(value) => handleInputChange('source', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a pixel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Facebook Pixel">Facebook Pixel</SelectItem>
              <SelectItem value="Google Analytics">Google Analytics</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* <div className="space-y-2">
          <label className="font-medium">Visited in the last</label>
          <Select
            defaultValue="60"
            onValueChange={(value) => handleInputChange('days', parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="60 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="60">60 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="180">180 days</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* <div className="space-y-2">
          <label className="font-medium">Name</label>
          <Input
            placeholder="Enter audience name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div> */}
      </div>
    </section>
  );

  // const renderLookalikeView = () => (
  //   <>
  //     <DialogHeader className="bg-brand-blue text-white px-4 py-4 flex flex-row items-center">
  //       <Button
  //         variant="ghost"
  //         size="icon"
  //         className="mr-2 text-white hover:bg-brand-blue/80"
  //         onClick={handleBack}
  //       >
  //         <ArrowLeft size={18} />
  //       </Button>
  //       <DialogTitle className="text-xl">Lookalike</DialogTitle>
  //     </DialogHeader>

  //     <div className="p-6 space-y-6">
  //       <div className="space-y-2">
  //         <label className="font-medium">Source audience</label>
  //         <p className="text-sm text-blue-600 mb-2">
  //           How does lookalike audience syncing work? <span className="underline">Learn more</span>
  //         </p>
  //         <Select onValueChange={(value) => handleInputChange('sourceAudience', value)}>
  //           <SelectTrigger className="w-full">
  //             <SelectValue placeholder="Select an audience" />
  //           </SelectTrigger>
  //           <SelectContent>
  //             {audiencesData.map(audience => (
  //               <SelectItem key={audience.id} value={audience.id}>
  //                 {audience.name}
  //               </SelectItem>
  //             ))}
  //           </SelectContent>
  //         </Select>
  //       </div>

  //     </div>

  //     <div className="border-t p-4 flex justify-between">
  //       <Button onClick={handleClose} variant="outline">
  //         Cancel
  //       </Button>
  //       <Button
  //         className="bg-[#ff7a59] hover:bg-[#ff7a59]/90 text-white"
  //         onClick={handleCreateAudience}
  //         disabled={!formData.sourceAudience}
  //       >
  //         Create audience
  //       </Button>
  //     </div>
  //   </>
  // );

  const renderContent = () => {
    switch (currentView) {
      case "website-visitors":
        return renderWebsiteVisitorsView();
      // case 'lookalike':
      //   return renderLookalikeView();
      case "initial":
      default:
        return renderInitialView();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-xl rounded-md overflow-auto">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAudienceDialog;
