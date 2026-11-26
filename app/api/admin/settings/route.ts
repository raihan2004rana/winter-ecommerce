import { NextRequest, NextResponse } from "next/server";
import { AdminStore } from "@/lib/server/admin-store";
import { getAdminSessionFromRequest, hasPermission } from "@/lib/server/admin-auth";

export async function GET() {
  try {
    const settings = AdminStore.getSettings();
    const taxRules = AdminStore.getTaxRules();
    const shippingZones = AdminStore.getShippingZones();
    return NextResponse.json({
      status: "success",
      data: settings,
      settings,
      taxRules,
      shippingZones,
    });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = getAdminSessionFromRequest(request);
    if (!hasPermission(session.role, "settings:write")) {
      return NextResponse.json({ status: "fail", message: "Forbidden: insufficient permissions." }, { status: 403 });
    }

    const body = await request.json();
    const actor = { name: session.name, email: session.email };

    let updatedSettings = null;
    if (body.settings) {
      updatedSettings = AdminStore.updateSettings(body.settings, actor);
    } else if (body.storeName) {
      updatedSettings = AdminStore.updateSettings(body, actor);
    }

    if (body.taxRules && Array.isArray(body.taxRules)) {
      for (const rule of body.taxRules) {
        if (rule.countryCode) {
          AdminStore.updateTaxRule(rule.countryCode, rule, actor);
        }
      }
    }

    if (body.shippingZones && Array.isArray(body.shippingZones)) {
      for (const zone of body.shippingZones) {
        if (zone.id) {
          AdminStore.updateShippingZone(zone.id, zone, actor);
        }
      }
    }

    return NextResponse.json({
      status: "success",
      data: updatedSettings || AdminStore.getSettings(),
      settings: updatedSettings || AdminStore.getSettings(),
      taxRules: AdminStore.getTaxRules(),
      shippingZones: AdminStore.getShippingZones(),
    });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
