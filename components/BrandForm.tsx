"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { IconDisplay } from "./IconDisplay";
import { generateIcons } from "@/app/actions/generate-icons";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { brandFormSchema, type BrandFormValues } from "@/lib/schema";
import { iconStyles, type IconStyle } from "@/lib/styles";

export default function BrandForm() {
  const [tagInput, setTagInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIcons, setGeneratedIcons] = useState<string[]>([]);
  const [selectedIconIndex, setSelectedIconIndex] = useState<number>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      brandName: "",
      description: "",
      tags: [],
      style: undefined,
    },
  });

  const tags = watch("tags");
  const selectedStyle = watch("style");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() && tags.length < 10) {
      e.preventDefault();
      setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleStyleSelect = (style: IconStyle) => {
    setValue("style", style);
  };

  const onSubmit = async (data: BrandFormValues) => {
    try {
      setIsGenerating(true);
      setGeneratedIcons([]); // Clear previous icons
      const icons = await generateIcons(data);
      setGeneratedIcons(icons);
    } catch (error) {
      console.error("Failed to generate icons:", error);
      // You could add a toast notification here for errors
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container grid gap-6 lg:grid-cols-2">
      <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Create Your Brand Icon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Brand Name Input */}
          <div className="space-y-2">
            <label htmlFor="brandName" className="text-sm font-medium">
              Brand Name
            </label>
            <Input
              id="brandName"
              {...register("brandName")}
              placeholder="Enter your brand name"
            />
            {errors.brandName && (
              <p className="text-sm text-destructive">{errors.brandName.message}</p>
            )}
          </div>

          {/* Brand Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Brand Description
            </label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="What does your brand do?"
              className="min-h-[100px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags (1-10)
            </label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag and press Enter"
              disabled={tags.length >= 10}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-xs hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                </Badge>
              ))}
            </div>
            {errors.tags && (
              <p className="text-sm text-destructive">{errors.tags.message}</p>
            )}
          </div>

          {/* Style Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Icon Style</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(iconStyles).map(([key, style]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleStyleSelect(key as IconStyle)}
                  className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors ${
                    selectedStyle === key ? "border-primary" : "border-border"
                  }`}
                >
                  <span className="text-2xl">{style.icon}</span>
                  <span className="text-sm">{style.label}</span>
                  <span className="text-xs text-muted-foreground text-center px-2">
                    {style.description}
                  </span>
                </button>
              ))}
            </div>
            {errors.style && (
              <p className="text-sm text-destructive">{errors.style.message}</p>
            )}
          </div>

          {/* Generate Button */}
          <Button type="submit" className="w-full">
            Generate Icons
          </Button>
        </form>
      </CardContent>
    </Card>
    <div className="w-full space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Generated Icons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IconDisplay
            icons={generatedIcons}
            isLoading={isGenerating}
            onSelect={setSelectedIconIndex}
            selectedIndex={selectedIconIndex}
          />
        </CardContent>
      </Card>
    </div>
  </div>
  );
}